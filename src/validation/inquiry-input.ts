import { z } from 'zod';

export const inquiryStatusSchema = z.enum(['NEW','OPEN','AWAITING_CUSTOMER','RESOLVED','CLOSED']);
export const inquiryInputSchema = z.object({
  name:z.string().trim().min(1).max(150),email:z.email().trim().toLowerCase(),
  phone:z.string().trim().max(40).optional(),organization:z.string().trim().max(200).optional(),
  categoryId:z.string().min(1),serviceId:z.string().min(1),subject:z.string().trim().min(1).max(200),message:z.string().trim().min(1).max(10000),
}).strict();
