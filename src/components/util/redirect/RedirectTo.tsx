export const RedirectTo = ({ url }: { url: string }) => {
  return (
    <div
      style={{
        minHeight: '80vh',
        width: '100%',
      }}
    >
      <meta httpEquiv='refresh' content={`0; url=${url}`} />
      <a
        style={{
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: '20vh',
          position: 'relative',
          display: ' block',
          width: 'fit-content',
        }}
        href={url}
      >
        Please click here if you are not redirected
      </a>
    </div>
  );
};
