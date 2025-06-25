import { Link } from "react-router-dom";
import { useWithDrawApplicant } from "../customHooks/useAppliedJob";

const AppliedJobList = ({ isLoading, appliedJobs, error }) => {
  const { mutate: withdraw, isPending } = useWithDrawApplicant();
  const handleWithdraw = (id) => {
    withdraw(id, {
      onSuccess: (res) => {
        alert(res); // e.g., "Application withdrawn successfully"
      },
      onError: (err) => {
        const status = err?.response?.status;
        const message = err?.response?.data || "Something went wrong";
        alert(`Error ${status}: ${message}`);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="text-gray-400 text-center w-full py-4">
        Loading applied jobs...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center w-full py-4">
        Error loading jobs.
      </div>
    );
  }

  if (!Array.isArray(appliedJobs) || appliedJobs.length === 0) {
    return (
      <div className="text-gray-400 text-center w-full py-4">
        No jobs applied yet.
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 w-full">
      {appliedJobs.map((job, index) => (
        <div
          key={job.id || index}
          className="bg-gray-800 p-5 rounded-2xl shadow-lg border border-gray-700 hover:border-blue-500 transition-all flex flex-col justify-between"
        >
          <div>
            <h3 className="text-xl text-white font-semibold mb-3 break-words">
              {job.title ||
                `Application ID: ${job.id?.slice(-6).toUpperCase()}`}
            </h3>

            <p className="text-gray-400 text-sm mb-1">
              <span className="font-medium">Status:</span> {job.status}
            </p>

            <p className="text-gray-400 text-sm mb-1">
              <span className="font-medium">Applied on:</span>{" "}
              {new Date(job.appliedOn).toLocaleDateString()}
            </p>

            <p className="text-gray-400 text-sm mb-1 break-all">
              <span className="font-medium">Resume:</span>{" "}
              <a
                href={job.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                View
              </a>
            </p>

            <p className="text-gray-400 text-sm mb-1 break-words">
              <span className="font-medium">Email:</span> {job.applicantEmail}
            </p>

            <p className="text-gray-400 text-sm mb-2 break-all">
              <span className="font-medium">Job ID:</span> {job.jobId}
            </p>
          </div>

          <Link
            to={`/jobs/${job.jobId}`}
            className="text-sm text-blue-500 no-underline mt-3 inline-block hover:underline"
          >
            View Job Posting →
          </Link>
          <button
            onClick={() => handleWithdraw(job.id)}
            disabled={isPending}
            className={`mt-2 px-4 py-1 rounded text-sm text-white cursor-pointer ${
              isPending
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isPending ? "Withdrawing..." : "Withdraw"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default AppliedJobList;
