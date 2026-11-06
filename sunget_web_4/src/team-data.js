// =========================================================
// ABOUT PAGE DATA  (src/team-data.js)
// Everything on pgs/about_us.html that is a list lives here:
// hero slides, culture photos, timeline, team, values, certificates.
//
// DEMO CONTENT: names, photos, bios, years and certificates below
// are PLACEHOLDERS. Replace them with real details, then set
//   demo: false
// to remove the "Demo content" bar at the top of the page.
//
// PHOTOS: save team photos in  images/team/  (portrait 800x1000,
// WebP or JPG) and set  photo: "images/team/your-file.webp"
// Leave photo: "" to show the placeholder silhouette.
// =========================================================
window.ABOUT_DATA = {
  demo: true,

  // ---------- Hero image carousel ----------
  // Stock photos for the demo. Replace with real team / site photos.
  hero: [
    { img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1400&q=75", caption: "Rooftop installations across Maharashtra" },
    { img: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1400&q=75", caption: "Engineering that is built to last" },
    { img: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1400&q=75", caption: "Skilled crews on every site" },
    { img: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1400&q=75", caption: "Clean energy for homes and businesses" }
  ],

  // ---------- Culture photo grid (7 tiles) ----------
  culture: [
    { label: "Team collaboration", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1000&q=70" },
    { label: "Creative brainstorming", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=70" },
    { label: "Learning and development", img: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=70" },
    { label: "Office environment", img: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=800&q=70" },
    { label: "Team celebrations", img: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&q=70" },
    { label: "Team activities", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=70" },
    { label: "Company events", img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=70" }
  ],

  // ---------- Timeline (sample years, edit freely) ----------
  timeline: [
    { year: "2015", title: "The Beginning", text: "SunGET starts with a small team and a clear goal: make solar simple and dependable for Pune.", img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=70" },
    { year: "2017", title: "Building Our Foundation", text: "First large projects delivered, and a standard process for survey, design and installation is set.", img: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=70" },
    { year: "2019", title: "Growing Our Team", text: "Engineers, project managers and service technicians join, and work expands across Maharashtra.", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=70" },
    { year: "2021", title: "Expanding Our Services", text: "Solar water heating, heat pumps and maintenance contracts join the rooftop offering.", img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=70" },
    { year: "2023", title: "New Opportunities", text: "Turnkey EPC for factories and institutions, with energy audits to size every plant precisely.", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=70" },
    { year: "2025", title: "Building Bigger Things", text: "Larger plants, CSR drives and awareness programmes that bring clean energy to more communities.", img: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&q=70" },
    { year: "2026", title: "Moving Forward", text: "A growing team, a stronger service network and the same promise: power that pays you back.", img: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=800&q=70" }
  ],

  // ---------- Team ----------
  // category must match one of the ids below.
  categories: [
    { id: "all", label: "All team members" },
    { id: "leadership", label: "Leadership" },
    { id: "engineering", label: "Engineering & Projects" },
    { id: "sales", label: "Sales & Customer Care" },
    { id: "operations", label: "Operations & O&M" }
  ],

  // linkedin values below are demo placeholders (they open linkedin.com).
  // Put each person's real profile URL, or "" to hide the icon.
  team: [
    { name: "Dipak Kotkar", role: "Founder", category: "leadership", photo: "/images/team/sir.jpg",
      bio: "Sets the company direction and keeps every project aligned with SunGET's quality promise.",
      skills: ["Strategy", "Client relations", "Business growth"], linkedin: "https://www.linkedin.com/in/dipakkotkar/" },
    { name: "Team Member 02", role: "Director, Projects", category: "leadership", photo: "",
      bio: "Oversees large installations from first survey to final handover.",
      skills: ["EPC delivery", "Planning", "Team leadership"], linkedin: "https://www.linkedin.com/" },
    { name: "Team Member 03", role: "Head of Operations", category: "leadership", photo: "",
      bio: "Keeps teams, materials and schedules working smoothly across every site.",
      skills: ["Operations", "Procurement", "Process design"], linkedin: "https://www.linkedin.com/" },
    { name: "Team Member 04", role: "Head of Engineering", category: "engineering", photo: "",
      bio: "Leads system design and structural checks so every plant is safe and productive.",
      skills: ["System design", "Structural review", "PV modelling"], linkedin: "https://www.linkedin.com/" },
    { name: "Team Member 05", role: "Senior Solar Design Engineer", category: "engineering", photo: "",
      bio: "Prepares layouts, electrical drawings and generation estimates for each proposal.",
      skills: ["AutoCAD", "Single line diagrams", "Shadow analysis"], linkedin: "https://www.linkedin.com/" },
    { name: "Team Member 06", role: "Project Manager", category: "engineering", photo: "",
      bio: "Coordinates crews, deliveries and approvals so projects finish on schedule.",
      skills: ["Scheduling", "Site safety", "Vendor coordination"], linkedin: "https://www.linkedin.com/" },
    { name: "Team Member 07", role: "Site Supervisor", category: "engineering", photo: "",
      bio: "Checks quality at each stage of installation, testing and commissioning.",
      skills: ["Quality checks", "Testing", "Commissioning"], linkedin: "https://www.linkedin.com/" },
    { name: "Team Member 08", role: "Head of Sales", category: "sales", photo: "",
      bio: "Guides customers to the right system and a clear, honest proposal.",
      skills: ["Solar consulting", "Proposals", "Financing options"], linkedin: "https://www.linkedin.com/" },
    { name: "Team Member 09", role: "Solar Consultant", category: "sales", photo: "",
      bio: "Visits homes and businesses, reviews bills and explains subsidy and savings.",
      skills: ["Site surveys", "Subsidy guidance", "Bill analysis"], linkedin: "https://www.linkedin.com/" },
    { name: "Team Member 10", role: "Customer Care Lead", category: "sales", photo: "",
      bio: "First point of contact for questions, updates and service requests.",
      skills: ["Communication", "Follow-up", "Problem solving"], linkedin: "https://www.linkedin.com/" },
    { name: "Team Member 11", role: "O&M Manager", category: "operations", photo: "",
      bio: "Runs maintenance contracts, health checks and repairs to keep plants at peak output.",
      skills: ["Preventive maintenance", "Thermal imaging", "String testing"], linkedin: "https://www.linkedin.com/" },
    { name: "Team Member 12", role: "Approvals & Net-Metering Officer", category: "operations", photo: "",
      bio: "Handles DISCOM applications, inspections and net-metering paperwork for customers.",
      skills: ["DISCOM process", "Documentation", "Net-metering"], linkedin: "https://www.linkedin.com/" }
  ],

  // ---------- Values ----------
  // icon: one of  people, bulb, spark, shield, eye, star
  values: [
    { icon: "people", title: "Collaboration", text: "Engineers, consultants and crews work as one team, because good solar needs all of them." },
    { icon: "bulb", title: "Innovation", text: "We keep learning new technology and methods, and use what truly helps customers." },
    { icon: "spark", title: "Creativity", text: "Every roof and every site is different, so we design for it instead of copying a template." },
    { icon: "shield", title: "Trust", text: "We do what we say, stand behind our work and stay after the installation is done." },
    { icon: "eye", title: "Transparency", text: "Clear proposals, honest numbers and no hidden costs from the first call onwards." },
    { icon: "star", title: "Excellence", text: "Careful design, quality equipment and safe installation on every project." }
  ],

  // ---------- Certificates & approvals (demo tiles) ----------
  certs: [
    { name: "Certificate 1", note: "Add name and year", img: "/images/cert/img1.png" },
    { name: "Certificate 2", note: "Add name and year", img: "/images/cert/img2.png" },
    { name: "Certificate 3", note: "Add name and year", img: "/images/cert/img3.png" },
    { name: "Certificate 4", note: "Add name and year", img: "/images/cert/img4.png" }
  ]
};
