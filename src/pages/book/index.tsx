const RedirectBook: React.FC = () => {
  console.log('redirecting to docs');
  return (
    <div>
      <meta httpEquiv='refresh' content='0; url=book/docs/intro/index.html' />
      <a href='book/docs/intro/index.html'>please click here if you are not redirected</a>
    </div>
  );
};

export default RedirectBook;
