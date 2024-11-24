import { ResumeDto } from "@reactive-resume/dto";

import { axios } from "@/client/libs/axios";
import { RESUME_LISTING_KEY } from "@/client/constants/query-keys";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export const fetchPublicResumeListing = async (data: {
  page: number;
  limit: number;
  featured: boolean;
  skills?: string;
  languages?: string;
}) => {
  const response = await axios.get<ResumeDto[], AxiosResponse<ResumeDto[]>>(
    `/resume-listing?page=${data.page}&limit=${data.limit}&featured=${data.featured}&skills=${data.skills ?? ``}&languages=${data.languages ?? ``}`,
  );

  return response.data;
};

export const useResumeListing = (data: {
  page: number;
  limit: number;
  featured: boolean;
  skills?: string;
  languages?: string;
}) => {
  const {
    error,
    isPending: loading,
    data: resumes,
  } = useQuery({
    queryKey: [...RESUME_LISTING_KEY, data],
    queryFn: () => fetchPublicResumeListing(data),
  });

  return { resumes, loading, error };
};

export const useFeaturedResumes = (data: {
  page: number;
  limit: number;
  featured: boolean;
  skills?: string;
  languages?: string;
}) => {
  const {
    error,
    isPending: loading,
    data: resumes,
  } = useQuery({
    queryKey: [...RESUME_LISTING_KEY, data],
    queryFn: () => fetchPublicResumeListing(data),
  });

  return { resumes, loading, error };
};
