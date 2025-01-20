// zod for the schema validation

import { z } from "zod";    

export const acceptMessageSchema = z.object({
    isacceptingmssg: z.boolean(),
})
