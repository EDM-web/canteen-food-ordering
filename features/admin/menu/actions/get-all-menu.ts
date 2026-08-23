// "use server";

// import { prisma } from "@/lib/prisma";

// export const getAllMenu = async (isAdmin: boolean = false) => {
//   try {
//     return await prisma.menuItem.findMany({
//       orderBy: {
//         createdAt: "desc",
//       },
//       where: isAdmin ? {} : { isAvailable: true },
//       include: {
//         category: {
//           select: {
//             name: true,
//           },
//         },
//       },
//     });
//   } catch (error) {
//     console.error(error);
//   }
// };

"use server";

import { prisma } from "@/lib/prisma";

export const getAllMenu = async (isAdmin: boolean = false, query?: string) => {
  try {
    // prisma.menuItem.findMany ရဲ့ where type ကို တိုက်ရိုက်ယူသုံးခြင်း
    const where: NonNullable<
      Parameters<typeof prisma.menuItem.findMany>[0]
    >["where"] = {};

    if (!isAdmin) {
      where.isAvailable = true;
    }

    if (query) {
      where.name = {
        contains: query,
      };
    }

    return await prisma.menuItem.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where,
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
  }
};
