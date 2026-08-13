import { PrismaClient, type SitePage } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ---- Admin: default super admin ----
  const passwordHash = await bcrypt.hash("ChangeMe!2026", 10);
  await prisma.adminUser.upsert({
    where: { email: "admin@damcng.com" },
    update: {},
    create: {
      name: "DAMC Super Admin",
      email: "admin@damcng.com",
      passwordHash,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      canPublishContent: true,
      canViewEnquiries: true,
      canAssignEnquiries: true,
      canViewAnalytics: true,
    },
  });

  // ---- About: founders (deterministic ids so re-seeding never duplicates) ----
  const founders = [
    { id: "founder-1", name: "Chief Adebayo Okonkwo", title: "Founding President", order: 0 },
    { id: "founder-2", name: "Engr. Chukwuemeka Nwosu", title: "Founding Secretary", order: 1 },
    { id: "founder-3", name: "Barr. Olumide Fashina", title: "Founding Treasurer", order: 2 },
  ];
  for (const f of founders) {
    await prisma.founder.upsert({
      where: { id: f.id },
      update: {},
      create: { id: f.id, name: f.name, title: f.title, order: f.order },
    });
  }

  // ---- About: milestones (deterministic ids) ----
  const milestones = [
    { id: "milestone-2016", year: 2016, title: "DAMC founded", description: "A small group of friends in Lagos formalized the club.", order: 0 },
    { id: "milestone-2019", year: 2019, title: "First community outreach", description: "Launched an annual charity drive for underprivileged families.", order: 1 },
    { id: "milestone-2023", year: 2023, title: "Clubhouse established", description: "Secured a permanent venue for monthly general meetings.", order: 2 },
  ];
  for (const m of milestones) {
    await prisma.milestone.upsert({
      where: { id: m.id },
      update: {},
      create: { id: m.id, year: m.year, title: m.title, description: m.description, order: m.order },
    });
  }

  // ---- Executive categories (deterministic ids; update: {} so re-seeding
  // never overwrites an admin's rename or reorder) ----
  const executiveCategories = [
    { id: "exec-cat-president", name: "President", order: 0 },
    { id: "exec-cat-vice-president", name: "Vice President", order: 10 },
    { id: "exec-cat-secretary", name: "Secretary", order: 20 },
    { id: "exec-cat-social-secretary", name: "Social Secretary", order: 30 },
    { id: "exec-cat-assistant-secretary", name: "Assistant Secretary", order: 40 },
    { id: "exec-cat-treasurer", name: "Treasurer", order: 50 },
    { id: "exec-cat-financial-secretary", name: "Financial Secretary", order: 60 },
    { id: "exec-cat-assistant-financial-secretary", name: "Assistant Financial Secretary", order: 70 },
    { id: "exec-cat-chief-provost", name: "Chief Provost", order: 80 },
    { id: "exec-cat-legal-adviser", name: "Legal Adviser", order: 90 },
    { id: "exec-cat-welfare", name: "Welfare", order: 100 },
    { id: "exec-cat-pro", name: "PRO", order: 110 },
    { id: "exec-cat-ethics", name: "Ethics and Privileges Commission", order: 120 },
  ];
  for (const c of executiveCategories) {
    await prisma.executiveCategory.upsert({
      where: { id: c.id },
      update: {},
      create: c,
    });
  }

  // ---- Site content: homepage hero, who-we-are, about vision/mission, contact ----
  await prisma.siteContent.upsert({
    where: { page_section: { page: "HOME" as SitePage, section: "hero" } },
    update: {},
    create: {
      page: "HOME" as SitePage,
      section: "hero",
      content: {
        heading: "Dignified Articulate Men's Club",
        subheading:
          "A private membership club in Lagos uniting accomplished men in fellowship, wealth creation and service to the community.",
        ctaLabel: "Enquire about membership",
      },
    },
  });

  await prisma.siteContent.upsert({
    where: { page_section: { page: "HOME" as SitePage, section: "who-we-are" } },
    update: {},
    create: {
      page: "HOME" as SitePage,
      section: "who-we-are",
      content: {
        heading: "A brotherhood built on dignity and purpose",
        description:
          "DAMC brings together accomplished, articulate men in Lagos for fellowship, mutual support and community impact — bound by a shared commitment to conduct, culture and each other's success.",
        aims: [
          "A non-profit making private membership organization",
          "Social and recreational facilities for all its members",
          "Co-operation with charitable organizations helping the needy and less fortunate",
          "Unity and common purpose by encouraging members on wealth creation",
          "A non-governmental organization and a pressure group",
        ],
      },
    },
  });

  await prisma.siteContent.upsert({
    where: { page_section: { page: "ABOUT" as SitePage, section: "vision-mission" } },
    update: {},
    create: {
      page: "ABOUT" as SitePage,
      section: "vision-mission",
      content: {
        vision: "To be the foremost brotherhood of dignified, articulate men driving positive change in Lagos.",
        mission: "To foster unity, wealth creation and service among accomplished men committed to conduct and culture.",
        motto: "Uplift. Unite. Prosper.",
      },
    },
  });

  await prisma.siteContent.upsert({
    where: { page_section: { page: "CONTACT" as SitePage, section: "details" } },
    update: {},
    create: {
      page: "CONTACT" as SitePage,
      section: "details",
      content: {
        email: "info@damcng.com",
        phone: "+234 800 000 0000",
        address: "Placeholder address, Lagos, Nigeria",
        whatsapp: "https://wa.me/2348000000000",
        instagram: "https://instagram.com/damcofficial",
        facebook: "https://facebook.com/damcofficial",
        tiktok: "https://tiktok.com/@damcofficial",
      },
    },
  });

  // ---- Bulk demo data — guarded so re-seeding a populated DB is a no-op ----

  if ((await prisma.member.count()) === 0) {
    await prisma.member.createMany({
      data: [
        {
          id: "member-1",
          slug: "adebayo-okonkwo",
          firstName: "Adebayo",
          lastName: "Okonkwo",
          birthMonth: 3,
          birthDay: 14,
          isActive: true,
        },
        {
          id: "member-2",
          slug: "chukwuemeka-nwosu",
          firstName: "Chukwuemeka",
          lastName: "Nwosu",
          birthMonth: 8,
          birthDay: 2,
          isActive: true,
        },
        {
          id: "member-3",
          slug: "olumide-fashina",
          firstName: "Olumide",
          lastName: "Fashina",
          birthMonth: 11,
          birthDay: 27,
          isActive: true,
        },
      ],
    });
  }

  if ((await prisma.calendarEvent.count()) === 0) {
    const now = new Date();
    await prisma.calendarEvent.createMany({
      data: [
        {
          title: "Monthly General Meeting",
          type: "MEETING",
          date: new Date(now.getFullYear(), now.getMonth() + 1, 14),
        },
        {
          title: "Q3 Dues Deadline",
          type: "DUES",
          date: new Date(now.getFullYear(), now.getMonth() + 1, 30),
        },
        {
          title: "End of Year Holiday Party",
          type: "HOLIDAY",
          date: new Date(now.getFullYear(), 11, 20),
        },
      ],
    });
  }

  if ((await prisma.rosterEntry.count()) === 0) {
    const firstMember = await prisma.member.findFirst();
    if (firstMember) {
      await prisma.rosterEntry.create({
        data: {
          meetingDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 14),
          hosts: { connect: [{ id: firstMember.id }] },
        },
      });
    }
  }

  if ((await prisma.achievement.count()) === 0) {
    await prisma.achievement.createMany({
      data: [
        {
          title: "Community Health Outreach",
          description: "Provided free medical checkups to over 500 residents.",
          year: 2023,
          order: 0,
        },
        {
          title: "Scholarship Fund Launch",
          description: "Established an annual scholarship for underprivileged students.",
          year: 2024,
          order: 1,
        },
      ],
    });
  }

  if ((await prisma.galleryItem.count()) === 0) {
    await prisma.galleryItem.create({
      data: {
        title: "Annual General Meeting 2025",
        mediaType: "PHOTO",
        eventType: "Meeting",
        downloadable: true,
        photos: {
          create: [
            { url: "/placeholders/gallery-photo.svg", order: 0 },
            { url: "/placeholders/gallery-photo.svg", order: 1 },
          ],
        },
      },
    });
    await prisma.galleryItem.create({
      data: {
        title: "Holiday Party Highlights",
        mediaType: "VIDEO",
        eventType: "Party",
        downloadable: false,
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      },
    });
  }

  if ((await prisma.heroSlide.count()) === 0) {
    await prisma.heroSlide.createMany({
      data: [
        { imageUrl: "/placeholders/gallery-photo.svg", caption: "Fellowship", order: 0 },
        { imageUrl: "/placeholders/gallery-photo.svg", caption: "Service", order: 1 },
        { imageUrl: "/placeholders/gallery-photo.svg", caption: "Unity", order: 2 },
      ],
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
