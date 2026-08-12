const Footer = () => {
  return (
    <footer className="shrink-0 border-t border-border bg-background">
      <div className="flex w-full flex-col items-center justify-between gap-2 px-4 py-2 text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} Streaming Web</p>
        <p>Watch, connect, and enjoy.</p>
      </div>
    </footer>
  );
};

export default Footer;
