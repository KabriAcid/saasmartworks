import { openDatabase } from '../../src/db/client';
import { hashPassword } from '../../src/lib/passwords';
import * as s from '../../src/db/schema';
import { serviceCategories as catalog } from '../../src/lib/services-data';

export async function seedDatabase(db: ReturnType<typeof openDatabase>['db'], password: string) {
  const now=new Date('2026-09-28T09:00:00Z');
  const dates={createdAt:now,updatedAt:now};
  const sample={isDemo:true,...dates};
  const unit='services';
  const passwordHashes=await Promise.all([hashPassword(password),hashPassword(password),hashPassword(password)]);
  await db.transaction(async tx=>{
    await tx.insert(s.businessUnits).values([
      {id:unit,slug:'professional-services',name:'Professional & Digital Services',active:true},
      {id:'eatery',slug:'eatery',name:'SA’A Eatery',active:false},
    ]).onConflictDoNothing();
    await tx.insert(s.serviceCategories).values([
      {id:'consultancy',businessUnitId:unit,slug:'management-consultancy',name:'Management Consultancy'},
      {id:'digital',businessUnitId:unit,slug:'digital-services',name:'Digital Services'},
      {id:'printing',businessUnitId:unit,slug:'printing-branding-design',name:'Printing, Branding & Creative Design'},
    ]).onConflictDoNothing();
    for(const [i,category] of catalog.entries()) {
      const categoryId=['consultancy','digital','printing'][i];
      await tx.insert(s.services).values(category.capabilities.map((name,sortOrder)=>({
        id:categoryId+'-service-'+(sortOrder+1),categoryId,slug:name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''),name,
        description:name+' — '+category.description,active:true,sortOrder,...dates,
      }))).onConflictDoNothing();
    }
    const staff=[
      {id:'demo-admin',name:'Demo Administrator',email:'admin@saa.example',passwordHash:passwordHashes[0]},
      {id:'demo-manager',name:'Demo Services Manager',email:'manager@saa.example',passwordHash:passwordHashes[1]},
      {id:'demo-finance',name:'Demo Finance Officer',email:'finance@saa.example',passwordHash:passwordHashes[2]},
    ];
    await tx.insert(s.users).values(staff.map(user=>({...user,status:'ACTIVE' as const,mustChangePassword:true,...sample}))).onConflictDoNothing();
    const modules=['inquiries','services','contacts','clients','projects','training','printing','quotations','invoices','payments','expenses','files','notifications','settings','users','roles','employees','business_units','audit'];
    const permissionIds=modules.flatMap(name=>[name+'.view',name+'.manage']).concat(['inquiries.reply','inquiries.assign']);
    await tx.insert(s.permissions).values(permissionIds.map(id=>({id,description:id.replaceAll('.',' ')}))).onConflictDoNothing();
    await tx.insert(s.roles).values([
      {id:'demo-administrator',name:'Demo Administrator',description:'Sample all-module role scoped through user_roles',...dates},
      {id:'demo-services-manager',name:'Demo Services Manager',description:'Sample service operations role',...dates},
      {id:'demo-finance-officer',name:'Demo Finance Officer',description:'Sample finance role',...dates},
    ]).onConflictDoNothing();
    for(const roleId of ['demo-administrator','demo-services-manager','demo-finance-officer']) {
      const allowed=permissionIds.filter(p=>roleId==='demo-administrator'||(roleId==='demo-services-manager' ? /^(inquiries|services|contacts|clients|projects|training|printing|files|notifications)\./.test(p) : /^(quotations|invoices|payments|expenses)\./.test(p)));
      await tx.insert(s.rolePermissions).values(allowed.map(permissionId=>({roleId,permissionId}))).onConflictDoNothing();
    }
    await tx.insert(s.userRoles).values(staff.map((u,i)=>({userId:u.id,roleId:['demo-administrator','demo-services-manager','demo-finance-officer'][i],businessUnitId:unit}))).onConflictDoNothing();
    await tx.insert(s.employees).values(staff.map((u,i)=>({id:'demo-employee-'+i,businessUnitId:unit,userId:u.id,employeeNumber:'DEMO-EMP-00'+(i+1),name:u.name,email:u.email,jobTitle:['Administrator','Services Manager','Finance Officer'][i],...sample}))).onConflictDoNothing();
    await tx.insert(s.contacts).values([
      {id:'demo-contact-1',name:'Amina Demo',email:'amina@example.com',organization:'Example Community Initiative',...sample},
      {id:'demo-contact-2',name:'Musa Demo',email:'musa@example.com',organization:'Example Learning Centre',...sample},
      {id:'demo-contact-3',name:'Zara Demo',email:'zara@example.com',organization:'Example Print Client',...sample},
    ]).onConflictDoNothing();
    await tx.insert(s.clients).values([1,2].map(n=>({id:'demo-client-'+n,contactId:'demo-contact-'+n,businessUnitId:unit,reference:'DEMO-CL-00'+n,status:'ACTIVE' as const,notes:'Fictional development record',...sample}))).onConflictDoNothing();
    const inquiryRows=[
      {id:'demo-inquiry-1',reference:'DEMO-INQ-001',contactId:'demo-contact-1',categoryId:'consultancy',serviceId:'consultancy-service-1',subject:'DEMO: Capacity-building workshop',status:'OPEN' as const},
      {id:'demo-inquiry-2',reference:'DEMO-INQ-002',contactId:'demo-contact-2',categoryId:'digital',serviceId:'digital-service-1',subject:'DEMO: Digital support request',status:'AWAITING_CUSTOMER' as const},
      {id:'demo-inquiry-3',reference:'DEMO-INQ-003',contactId:'demo-contact-3',categoryId:'printing',serviceId:'printing-service-1',subject:'DEMO: Printed learning materials',status:'NEW' as const},
    ];
    await tx.insert(s.inquiries).values(inquiryRows.map(row=>({...row,businessUnitId:unit,assignedTo:'demo-manager',...sample}))).onConflictDoNothing();
    await tx.insert(s.inquiryAssignments).values(inquiryRows.map((row,i)=>({id:'demo-assignment-'+i,inquiryId:row.id,assignedTo:'demo-manager',assignedBy:'demo-admin',...dates}))).onConflictDoNothing();
    await tx.insert(s.inquiryMessages).values(inquiryRows.map((row,i)=>({id:'demo-message-'+i,inquiryId:row.id,authorType:'CONTACT' as const,contactAuthorId:row.contactId,body:'Fictional inquiry message for dashboard development. No email was sent.',emailDeliveryStatus:'NOT_APPLICABLE' as const,...sample}))).onConflictDoNothing();
    await tx.insert(s.inquiryMessages).values({id:'demo-staff-reply',inquiryId:'demo-inquiry-2',authorType:'STAFF',staffAuthorId:'demo-manager',body:'DEMO: Please share the device details and preferred time.',emailDeliveryStatus:'NOT_APPLICABLE',...sample}).onConflictDoNothing();
    await tx.insert(s.projects).values([
      {id:'demo-project-1',businessUnitId:unit,clientId:'demo-client-1',reference:'DEMO-PRJ-001',name:'DEMO: Community capacity building',description:'Fictional consultancy engagement.',managerId:'demo-manager',status:'ACTIVE',startDate:now,endDate:new Date('2026-10-30T17:00:00Z'),...sample},
      {id:'demo-project-2',businessUnitId:unit,clientId:'demo-client-2',reference:'DEMO-PRJ-002',name:'DEMO: Digital literacy programme',description:'Fictional training engagement.',managerId:'demo-manager',status:'PLANNED',...sample},
    ]).onConflictDoNothing();
    await tx.insert(s.trainingSessions).values({id:'demo-training-1',businessUnitId:unit,clientId:'demo-client-1',projectId:'demo-project-1',title:'DEMO: Facilitation workshop',theme:'Capacity building',venue:'Example training room',facilitatorId:'demo-manager',startDate:new Date('2026-10-05T08:00:00Z'),endDate:new Date('2026-10-05T16:00:00Z'),...sample}).onConflictDoNothing();
    await tx.insert(s.trainingParticipants).values({trainingId:'demo-training-1',contactId:'demo-contact-2',attendance:'REGISTERED'}).onConflictDoNothing();
    await tx.insert(s.printingJobs).values({id:'demo-print-1',businessUnitId:unit,clientId:'demo-client-2',reference:'DEMO-PRINT-001',title:'DEMO: Workshop handouts',specifications:'A4, monochrome, stapled. Sample specifications only.',quantity:50,assignedTo:'demo-manager',status:'IN_PROGRESS',...sample}).onConflictDoNothing();
    const financial={businessUnitId:unit,clientId:'demo-client-1',projectId:'demo-project-1',currency:'NGN',subtotalMinor:15000000,discountMinor:0,taxMinor:0,totalMinor:15000000,...sample};
    await tx.insert(s.quotations).values({id:'demo-quote-1',reference:'DEMO-Q-001',status:'ACCEPTED',...financial}).onConflictDoNothing();
    await tx.insert(s.quotationItems).values({id:'demo-quote-item-1',quotationId:'demo-quote-1',description:'DEMO: Workshop facilitation',quantity:1,unitPriceMinor:15000000,totalMinor:15000000}).onConflictDoNothing();
    await tx.insert(s.invoices).values({id:'demo-invoice-1',reference:'DEMO-INV-001',quotationId:'demo-quote-1',status:'ISSUED',dueAt:new Date('2026-10-15T00:00:00Z'),...financial}).onConflictDoNothing();
    await tx.insert(s.invoiceItems).values({id:'demo-invoice-item-1',invoiceId:'demo-invoice-1',description:'DEMO: Workshop facilitation',quantity:1,unitPriceMinor:15000000,totalMinor:15000000}).onConflictDoNothing();
    await tx.insert(s.payments).values({id:'demo-payment-1',businessUnitId:unit,invoiceId:'demo-invoice-1',reference:'DEMO-PAY-001',currency:'NGN',amountMinor:5000000,method:'BANK_TRANSFER',status:'CONFIRMED',receivedAt:now,recordedBy:'demo-finance',...sample}).onConflictDoNothing();
    await tx.insert(s.expenses).values({id:'demo-expense-1',businessUnitId:unit,projectId:'demo-project-1',reference:'DEMO-EXP-001',description:'DEMO: Workshop materials',category:'Training materials',amountMinor:1250000,currency:'NGN',incurredAt:now,status:'PAID',recordedBy:'demo-finance',...sample}).onConflictDoNothing();
    await tx.insert(s.files).values({id:'demo-file-1',businessUnitId:unit,uploadedBy:'demo-manager',name:'DEMO-workshop-outline.pdf',mimeType:'application/pdf',sizeBytes:0,storageKey:'demo/not-uploaded/workshop-outline.pdf',status:'PENDING',projectId:'demo-project-1',...sample}).onConflictDoNothing();
    await tx.insert(s.notifications).values({id:'demo-notification-1',businessUnitId:unit,userId:'demo-manager',title:'DEMO: New inquiry',body:'Sample notification for the inquiry dashboard.',href:'/admin/inquiries',...sample}).onConflictDoNothing();
    await tx.insert(s.settings).values({id:'demo-setting-1',businessUnitId:unit,key:'demo.dashboard.currency',value:'NGN',updatedBy:'demo-admin',...dates}).onConflictDoNothing();
    await tx.insert(s.auditLogs).values({id:'demo-audit-1',businessUnitId:unit,actorId:'demo-admin',action:'DEMO_SEED',entityType:'seed',entityId:'non-eatery-v1',metadata:{fictional:true,version:1},isDemo:true,createdAt:now}).onConflictDoNothing();
  });
}
