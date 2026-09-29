// Rendered by SettingPage and passed into the client dialog as children.
export default function VerificationGuidelines() {
  return (
    <div className="space-y-3 text-sm leading-[1.55] text-[#52616B]">
      <p className="mb-6">
        You are eligible to apply for Verification at this time.
      </p>
      <p>
        Profile verification is for well-known creators on Clib who are most at
        risk of impersonation, or are emerging as notable and highly searched
        for. Clib holds the right to verify accounts at our discretion. If you
        apply for verification you must meet the following requirements at
        minimum:
      </p>
      <section className="space-y-1">
        <h2 className="text-base font-semibold">Notable</h2>
        <p>
          Your account must represent a well-known and/or highly searched for
          Artist, Collective, DJ, Label, Curator or Podcaster.
        </p>
      </section>
      <section className="space-y-1">
        <h2 className="text-base font-semibold">Unique</h2>
        <p>
          Your account must be the unique presence of an Artist, Collective, DJ,
          Label, Curator or Podcaster. We do not verify fan accounts or
          impersonators.
        </p>
      </section>
      <section className="space-y-1">
        <h2 className="text-base font-semibold">Clear purpose and intent</h2>
        <p>
          Your account should not contain any misleading information and it must
          adhere to our{" "}
          <span className="underline underline-offset-2">terms of use</span>.
        </p>
      </section>
      <section className="space-y-1">
        <h2 className="text-base font-semibold">Complete</h2>
        <p>
          Your account must have a bio, profile photo and at least one track
          uploaded.
          <br />
          It could take up to 30 days for our team to review your request. If
          you are a Next Pro subscriber your application review will be
          prioritized. Clib reserves the right to remove verification due to any
          breach of terms and conditions. If you change your display name your
          verified status will be at risk and you may need to reapply.
        </p>
      </section>
    </div>
  );
}
