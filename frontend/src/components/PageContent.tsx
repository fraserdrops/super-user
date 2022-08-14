function PageContent(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <div className="page-container">
      <div className="page-inner-container">
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
}

export default PageContent;
