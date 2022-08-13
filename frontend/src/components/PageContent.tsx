function PageContent(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <div className="user-container">
      <div className="user-details">{children}</div>
    </div>
  );
}

export default PageContent;
