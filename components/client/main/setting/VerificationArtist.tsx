"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getApiError } from "@/lib/api-error";
import {
  verificationKeys,
  verificationService,
} from "@/services/verification.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";

const primaryButton = "bg-[#1A75FF] text-white hover:bg-[#1464DC]";
const secondaryButton = "bg-[#ECEFF1] text-[#52616B] hover:bg-[#E1E5E8]";

export default function VerificationArtist({
  children,
}: {
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [artistName, setArtistName] = useState("");
  const [links, setLinks] = useState<string[]>([]);
  const [editingLink, setEditingLink] = useState(false);
  const [draftLink, setDraftLink] = useState("");
  const [linkError, setLinkError] = useState("");
  const [nameError, setNameError] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const id = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const addLinkRef = useRef<HTMLButtonElement>(null);
  const queryClient = useQueryClient();

  const { mutate: submitRequest, isPending } = useMutation({
    mutationFn: verificationService.createRequest,
    onSuccess: async () => {
      toast.success("Verification request submitted.");
      setOpen(false);
      setArtistName("");
      setLinks([]);
      await queryClient.invalidateQueries({ queryKey: verificationKeys.me });
    },
    onError: (error) => {
      const { message, errors } = getApiError(error);

      // The server validates links again, so surface a field error next to the
      // list rather than losing it inside a generic message.
      const linkIssue = errors.find((issue) => issue.field.startsWith("links"));
      if (linkIssue) setLinkError(linkIssue.message);

      const nameIssue = errors.find((issue) => issue.field === "artistName");
      if (nameIssue) setNameError(nameIssue.message);

      setSubmitMessage(message);
    },
  });

  const finishEditingLink = () => {
    setEditingLink(false);
    setDraftLink("");
    setLinkError("");
    addLinkRef.current?.focus();
  };

  const addLink = () => {
    let url: URL;
    try {
      url = new URL(draftLink.trim());
      if (!["https:", "http:"].includes(url.protocol)) throw new Error();
    } catch {
      setLinkError(
        "Enter a valid website URL starting with https:// or http://.",
      );
      return;
    }
    if (links.includes(url.href)) {
      setLinkError("This link has already been added.");
      return;
    }
    setLinks((current) => [...current, url.href]);
    setSubmitMessage("");
    finishEditingLink();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitMessage("");
    if (!artistName.trim()) {
      setNameError("Enter the name of the artist, band or group.");
      nameRef.current?.focus();
      return;
    }
    if (editingLink && draftLink.trim()) {
      setLinkError("Add or cancel this link before submitting your request.");
      return;
    }
    submitRequest({ artistName: artistName.trim(), links });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button
            type="button"
            className="w-max cursor-pointer rounded-lg border border-gray-100 bg-[#f9f9f9] px-2.5 py-1 text-left text-blue-500 ring-0 hover:underline"
          />
        }
      >
        Request Verification
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        aria-describedby={undefined}
        className="max-h-[calc(100dvh-2rem)] w-[1000px] max-w-[calc(100%-2rem)] gap-0 overflow-y-auto bg-white p-5 text-[#52616B] sm:max-w-[calc(100%-2rem)] sm:p-6"
      >
        <DialogTitle className="mb-7 text-2xl leading-8 font-semibold text-[#2C2F33]">
          Request verification
        </DialogTitle>
        {children}
        <form
          onSubmit={handleSubmit}
          className="mt-5 border-t border-gray-100 pt-5"
        >
          <div className="w-full space-y-4 sm:max-w-[510px]">
            <div className="space-y-2">
              <Label htmlFor={`${id}-name`} className="text-sm font-semibold">
                Name of artist/band/group your profile represents
              </Label>
              <Input
                ref={nameRef}
                id={`${id}-name`}
                name="artistName"
                value={artistName}
                onChange={(event) => {
                  setArtistName(event.target.value);
                  setNameError("");
                  setSubmitMessage("");
                }}
                required
                maxLength={200}
                placeholder="Type your name"
                aria-invalid={Boolean(nameError)}
                aria-describedby={nameError ? `${id}-name-error` : undefined}
                className="h-11 rounded-xl border-0 bg-[#F7F7F7] px-3.5 placeholder:text-[#9AA8B3]"
              />
              {nameError && (
                <p
                  id={`${id}-name-error`}
                  role="alert"
                  className="text-sm text-red-600"
                >
                  {nameError}
                </p>
              )}
            </div>
            <div className="space-y-2.5">
              <div>
                <p id={`${id}-links-label`} className="text-sm font-semibold">
                  Additional links (Optional)
                </p>
                <p
                  id={`${id}-links-help`}
                  className="mt-1 text-[13px] leading-5"
                >
                  Add links here to any press articles, web pages or social
                  profiles that could help us to review your online presence.
                </p>
              </div>
              {links.length > 0 && (
                <ul
                  aria-labelledby={`${id}-links-label`}
                  className="space-y-2.5"
                >
                  {links.map((link) => (
                    <li
                      key={link}
                      className="flex min-h-11 items-center gap-2 rounded-xl bg-[#F7F7F7] py-1 pr-2 pl-3.5"
                    >
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-w-0 flex-1 text-sm break-all hover:underline"
                      >
                        {link}
                      </a>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Remove ${link}`}
                        onClick={() => {
                          setLinks((current) =>
                            current.filter((item) => item !== link),
                          );
                          setSubmitMessage("");
                          addLinkRef.current?.focus();
                        }}
                      >
                        <Trash2 className="size-5" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
              {editingLink && (
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2 rounded-xl bg-[#F7F7F7] p-1.5">
                    <Input
                      autoFocus
                      type="url"
                      value={draftLink}
                      onChange={(event) => {
                        setDraftLink(event.target.value);
                        setLinkError("");
                        setSubmitMessage("");
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          addLink();
                        }
                      }}
                      aria-label="Additional link URL"
                      aria-describedby={`${id}-links-help${linkError ? ` ${id}-link-error` : ""}`}
                      aria-invalid={Boolean(linkError)}
                      placeholder="https://example.com/your-profile"
                      className="h-8 min-w-40 flex-1 border-0 bg-transparent placeholder:text-[#9AA8B3]"
                    />
                    <div className="ml-auto flex gap-2">
                      <Button
                        type="button"
                        className={`${secondaryButton} px-5`}
                        onClick={finishEditingLink}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        className={`${primaryButton} px-7`}
                        onClick={addLink}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                  {linkError && (
                    <p
                      id={`${id}-link-error`}
                      role="alert"
                      className="text-sm text-red-600"
                    >
                      {linkError}
                    </p>
                  )}
                </div>
              )}
              <Button
                ref={addLinkRef}
                type="button"
                variant="ghost"
                className="h-11 gap-2 rounded-xl bg-[#F7F7F7] px-3.5 font-normal text-[#2C2F33]"
                aria-expanded={editingLink}
                onClick={() => {
                  setEditingLink(true);
                  setSubmitMessage("");
                }}
              >
                <Plus className="size-4 text-[#52616B]" /> Add link
              </Button>
            </div>
          </div>
          {submitMessage && (
            <p role="status" className="mt-4 text-sm">
              {submitMessage}
            </p>
          )}
          <div className="mt-5 flex flex-col gap-4 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5">
              Submitting a request does not guarantee verification
            </p>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                className={`${secondaryButton} h-10 rounded-xl px-7 font-semibold`}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className={`${primaryButton} h-10 rounded-xl px-7 font-semibold`}
              >
                {isPending ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
