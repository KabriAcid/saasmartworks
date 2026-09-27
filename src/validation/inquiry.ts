import { z } from 'zod';
export const inquiryStatus = z.enum(['NEW','OPEN','AWAITING_CUSTOMER','RESOLVED','CLOSED']);
export const inquiryInput = z.object({name:z.string().trim().min(1).max(150),email:z.email(),phone:z.string().trim().max(40).optional(),organization:z.string().trim().max(200).optional(),categoryId:z.string().min(1),serviceId:z.string().min(1),subject:z.string().trim().min(1).max(200),message:z.string().trim().min(1).max(10000)});
