import { useFeaturedResumes, useResumeListing } from "@/client/services/resume/resume-listing";
import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { CircleNotch } from "@phosphor-icons/react";
import { sortByDate } from "@reactive-resume/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { ResumeCard } from "../dashboard/resumes/_layouts/grid/_components/resume-card";

export const ResumeListingPage = () => {
  const { i18n } = useLingui();
  const { resumes, loading } = useResumeListing({ page: 1, limit: 12, featured: false });
  const { resumes: featuredResumes, loading: featuredLoading } = useFeaturedResumes({
    page: 1,
    limit: 4,
    featured: true,
  });

  if (loading || featuredLoading)
    return (
      <div className="container flex justify-center py-10">
        <CircleNotch size={16} className="animate-spin" />
      </div>
    );

  return (
    <>
      <Helmet prioritizeSeoTags>
        <html lang={i18n.locale} />

        <title>
          {t`Reactive Resume`} - {t`A free and open-source resume builder`}
        </title>

        <meta name="description" content="Find good talent on your fingertips." />
      </Helmet>
      <div className="container">
        <div className="space-y-6 leading-loose">
          <h2 className="text-4xl font-bold">{t`Featured Resumes`}</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 py-4">
            {featuredResumes?.length ? (
              <AnimatePresence>
                {featuredResumes
                  .sort((a, b) => sortByDate(a, b, "updatedAt"))
                  .map((resume, index) => (
                    <motion.div
                      key={resume.id}
                      layout
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0, transition: { delay: (index + 2) * 0.1 } }}
                      exit={{ opacity: 0, filter: "blur(8px)", transition: { duration: 0.5 } }}
                    >
                      <ResumeCard resume={resume} isListing />
                    </motion.div>
                  ))}
              </AnimatePresence>
            ) : (
              <div className="flex items-center justify-center w-full sm:col-span-3 xl:col-span-4 2xl:col-span-5">
                <div className="flex justify-center py-10 opacity-50 print:hidden">
                  <span>{t`No featured Resumes available`}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-6 leading-loose mt-4">
          <h2 className="text-4xl font-bold">{t`Choose your next candidate`}</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 py-4">
            {resumes?.length ? (
              <AnimatePresence>
                {resumes
                  .sort((a, b) => sortByDate(a, b, "updatedAt"))
                  .map((resume, index) => (
                    <motion.div
                      key={resume.id}
                      layout
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0, transition: { delay: (index + 2) * 0.1 } }}
                      exit={{ opacity: 0, filter: "blur(8px)", transition: { duration: 0.5 } }}
                    >
                      <ResumeCard resume={resume} isListing />
                    </motion.div>
                  ))}
              </AnimatePresence>
            ) : (
              <div className="flex items-center justify-center w-full sm:col-span-3 xl:col-span-4 2xl:col-span-5">
                <div className="flex justify-center py-10 opacity-50 print:hidden">
                  <span>{t`No Resumes available`}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
