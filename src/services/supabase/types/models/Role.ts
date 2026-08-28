import z from "zod";

export const roleModel = z.object({
    role: z.string(),
    name: z.string(),
    description: z.string().nullable(),
});

const modelShape = roleModel.shape;
export const roleCreate = roleModel
.extend({
    role: modelShape.role.min(3),
    name: modelShape.name.min(3),
    description: modelShape.description.optional()
});

export const roleUpdate = roleCreate.partial();

export type Role = z.infer<typeof roleModel>;
export type RoleCreate = z.infer<typeof roleCreate>;
export type RoleUpdate = z.infer<typeof roleUpdate>;