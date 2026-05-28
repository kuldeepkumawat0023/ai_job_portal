import CompanyProfileView from "@/components/recruiter/settings/CompanyProfileView";
import SEO from "@/components/SEO";

export default function CompanyProfilePage() {
  return (
    <>
      <SEO
        props={{
          title: "Company Profile Settings | AIJobFit Recruiter",
          description: "Configure workspace settings, details about your business entity, website link, and office location.",
          url: "/recruiter/settings/profile",
          noIndex: true,
        }}
      />
      <CompanyProfileView />
    </>
  );
}
