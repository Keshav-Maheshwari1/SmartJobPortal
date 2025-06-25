import { useParams, Link } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import AuthButton from "../components/AuthButton";
import EligibilityList from "../components/EligibilityList";
import { useFetchJobById } from "../customHooks/useJob";
import Info from "../components/Info";
import TagList from "../components/TagList";

const JobDetailsPage = () => {
  const { jobId } = useParams();
  const { data: job, isLoading } = useFetchJobById(jobId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        Loading job details...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
        <p>Job not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center bg-gray-950 p-4 md:p-10 text-gray-300">
      <AuthCard title={job.title}>
        <div className="animate-fadeIn space-y-6">
          <p className="leading-relaxed text-sm">{job.description}</p>

          <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              Eligibility
            </h3>
            <EligibilityList eligibility={job.eligibility} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <Info label="Company" value={job.companyName} />
            <Info label="Location" value={job.location} />
            <Info label="Remote" value={job.isRemote ? "Yes" : "No"} />
            <Info label="Interview Mode" value={job.interviewMode} />
            <Info label="Experience Level" value={job.experienceLevel} />
            <Info label="Job Type" value={job.type} />
            <Info
              label="Salary"
              value={job.salary || "Will Be Disclosed Later"}
            />
            <Info
              label="Deadline"
              value={new Date(job.deadline).toLocaleString()}
            />
            <Info
              label="Posted On"
              value={new Date(job.createdAt).toLocaleDateString()}
            />
            <Info label="Status" value={job.status} />
            <Info label="Applicants Count" value={job.applicantsCount} />
            <Info label="Posted By" value={`${job.hrName} (${job.email})`} />
          </div>

          <div>
            <h3 className="text-md font-semibold text-blue-400 mb-2">
              Skills Required
            </h3>
            <TagList items={job.skills} />
          </div>

          <div>
            <h3 className="text-md font-semibold text-blue-400 mb-2">Tags</h3>
            <TagList items={job.tags} />
          </div>

          <div className="text-center mt-6">
            <Link to={`/jobs/${jobId}/apply`}>
              <AuthButton label="Apply Now" isLoading={false} />
            </Link>
          </div>
        </div>
      </AuthCard>
    </div>
  );
};

export default JobDetailsPage;
