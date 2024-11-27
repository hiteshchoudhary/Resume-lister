import { useFeaturedResumes, useResumeListing } from "@/client/services/resume/resume-listing";
import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { CircleNotch, MagnifyingGlass, X } from "@phosphor-icons/react";
import { sortByDate } from "@reactive-resume/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { ResumeCard } from "../dashboard/resumes/_layouts/grid/_components/resume-card";
import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeListingFilterSchema } from "@reactive-resume/dto";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Button,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Form,
  FormDescription,
  BadgeInput,
  Badge,
} from "@reactive-resume/ui";

type FormValues = z.infer<typeof resumeListingFilterSchema>;

export const ResumeListingPage = () => {
  const { i18n } = useLingui();
  const [pendingKeyword, setPendingKeyword] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(resumeListingFilterSchema),
    defaultValues: {
      skills: [],
      languages: [],
    },
  });

  const { resumes, loading } = useResumeListing({
    page: 1,
    limit: 12,
    featured: false,
    skills: form.watch("skills")?.join(","),
    languages: form.watch("languages")?.join(","),
  });
  const { resumes: featuredResumes, loading: featuredLoading } = useFeaturedResumes({
    page: 1,
    limit: 4,
    featured: true,
    skills: form.watch("skills")?.join(","),
    languages: form.watch("languages")?.join(","),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      console.log(data);
    } catch {
      form.reset();
    }
  };

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
        <div>
          <Form {...form}>
            <form
              ref={formRef}
              className="inline-flex items-stretch gap-4 w-full my-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                name="skills"
                control={form.control}
                render={({ field }) => {
                  return (
                    <div className="space-y-3 w-full">
                      <FormItem>
                        <FormLabel>{t`Skills`}</FormLabel>
                        <FormControl>
                          <BadgeInput
                            {...field}
                            placeholder="ReactJs,Angular"
                            value={field.value}
                            setPendingKeyword={setPendingKeyword}
                          />
                        </FormControl>
                        <FormDescription>
                          {t`You can add multiple skills by separating them with a comma or pressing enter.`}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>

                      <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
                        <AnimatePresence>
                          {field.value.map((item, index) => (
                            <motion.div
                              key={item}
                              layout
                              initial={{ opacity: 0, y: -50 }}
                              animate={{ opacity: 1, y: 0, transition: { delay: index * 0.1 } }}
                              exit={{ opacity: 0, x: -50 }}
                            >
                              <Badge
                                className="cursor-pointer"
                                onClick={() => {
                                  field.onChange(field.value.filter((v) => item !== v));
                                }}
                              >
                                <span className="mr-1">{item}</span>
                                <X size={12} weight="bold" />
                              </Badge>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                }}
              />

              <FormField
                name="languages"
                control={form.control}
                render={({ field }) => {
                  return (
                    <div className="space-y-3 w-full">
                      <FormItem>
                        <FormLabel>{t`Languages`}</FormLabel>
                        <FormControl>
                          <BadgeInput
                            {...field}
                            placeholder="English,Hindi"
                            value={field.value}
                            setPendingKeyword={setPendingKeyword}
                          />
                        </FormControl>
                        <FormDescription>
                          {t`You can add multiple languages by separating them with a comma or pressing enter.`}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>

                      <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
                        <AnimatePresence>
                          {field.value.map((item, index) => (
                            <motion.div
                              key={item}
                              layout
                              initial={{ opacity: 0, y: -50 }}
                              animate={{ opacity: 1, y: 0, transition: { delay: index * 0.1 } }}
                              exit={{ opacity: 0, x: -50 }}
                            >
                              <Badge
                                className="cursor-pointer"
                                onClick={() => {
                                  field.onChange(field.value.filter((v) => item !== v));
                                }}
                              >
                                <span className="mr-1">{item}</span>
                                <X size={12} weight="bold" />
                              </Badge>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                }}
              />

              <Button disabled={loading} className="w-fit mt-6">
                <MagnifyingGlass size={12} weight="bold" />
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-6 leading-loose">
          <h2 className="text-4xl font-bold">{t`Featured Resumes`}</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 py-4">
            {loading || featuredLoading ? (
              <div className="container flex justify-center py-10">
                <CircleNotch size={16} className="animate-spin" />
              </div>
            ) : featuredResumes?.length ? (
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
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 py-4">
            {loading || featuredLoading ? (
              <div className="container flex justify-center py-10">
                <CircleNotch size={16} className="animate-spin" />
              </div>
            ) : resumes?.length ? (
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
