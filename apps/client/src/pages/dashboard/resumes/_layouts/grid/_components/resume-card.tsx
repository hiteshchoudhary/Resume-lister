import { t } from "@lingui/macro";
import {
  CopySimple,
  DotsThreeVertical,
  FolderOpen,
  Lock,
  LockOpen,
  PencilSimple,
  TrashSimple,
} from "@phosphor-icons/react";
import { ResumeDto } from "@reactive-resume/dto";
import {
  Button,
  ContextMenu,
  ContextMenuSeparator,
  ContextMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@reactive-resume/ui";
import { cn } from "@reactive-resume/utils";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { useDialog } from "@/client/stores/dialog";

import { BaseCard } from "./base-card";
import { useAuthStore } from "@/client/stores/auth";

type Props = {
  resume: ResumeDto;
  isListing?: boolean;
};

export const ResumeCard = ({ resume, isListing }: Props) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { open } = useDialog<ResumeDto>("resume");
  const { open: lockOpen } = useDialog<ResumeDto>("lock");

  const lastUpdated = dayjs().to(resume.updatedAt);

  const onOpen = () => {
    if (!isListing) return navigate(`/builder/${resume.id}`);
    navigate(`/${resume?.data?.basics?.username}/${resume.slug}`);
  };

  const onUpdate = () => {
    open("update", { id: "resume", item: resume });
  };

  const onDuplicate = () => {
    open("duplicate", { id: "resume", item: resume });
  };

  const onLockChange = () => {
    lockOpen(resume.locked ? "update" : "create", { id: "lock", item: resume });
  };

  const onDelete = () => {
    open("delete", { id: "resume", item: resume });
  };

  const dropdownMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="aspect-square">
        <Button size="icon" variant="ghost" className="ml-auto">
          <DotsThreeVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={(event) => {
            event.stopPropagation();
            onOpen();
          }}
        >
          <FolderOpen size={14} className="mr-2" />
          {t`Open`}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(event) => {
            event.stopPropagation();
            onUpdate();
          }}
        >
          <PencilSimple size={14} className="mr-2" />
          {t`Rename`}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(event) => {
            event.stopPropagation();
            onDuplicate();
          }}
        >
          <CopySimple size={14} className="mr-2" />
          {t`Duplicate`}
        </DropdownMenuItem>
        {resume.locked ? (
          <DropdownMenuItem
            onClick={(event) => {
              event.stopPropagation();
              onLockChange();
            }}
          >
            <LockOpen size={14} className="mr-2" />
            {t`Unlock`}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={(event) => {
              event.stopPropagation();
              onLockChange();
            }}
          >
            <Lock size={14} className="mr-2" />
            {t`Lock`}
          </DropdownMenuItem>
        )}
        <ContextMenuSeparator />
        <DropdownMenuItem
          className="text-error"
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
        >
          <TrashSimple size={14} className="mr-2" />
          {t`Delete`}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <BaseCard
          className="space-y-0"
          onClick={onOpen}
          style={
            isListing
              ? {
                  backgroundImage: `url('/templates/jpg/${resume.data.metadata.template}.jpg')`,
                  backgroundSize: "cover",
                }
              : {}
          }
        >
          <AnimatePresence>
            {resume.locked && !isListing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-background/75 backdrop-blur-sm"
              >
                <Lock size={42} />
              </motion.div>
            )}
          </AnimatePresence>

          <div
            className={cn(
              "absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end space-y-0.5 p-4 pt-12 leading-none",
              "bg-gradient-to-t from-background/100 to-transparent",
            )}
          >
            <div className="inline-flex items-center gap-x-2">
              <h4 className="line-clamp-2 font-medium">{resume.title}</h4>
              {user?.id === resume.userId && dropdownMenu}
            </div>
            <p className="line-clamp-1 text-xs opacity-75">{t`Last updated ${lastUpdated}`}</p>
            {isListing && (
              <p className="line-clamp-1 text-xs opacity-75">{t`By ${resume.data?.basics.name}`}</p>
            )}
          </div>
        </BaseCard>
      </ContextMenuTrigger>
    </ContextMenu>
  );
};
