'use client';

type Props = {
  error: Error;
};

const Error = ({ error }: Props) => {
  return (
    <div>
      <h2>Could not fetch note details.</h2>
      <p>{error.message}</p>
    </div>
  );
}

export default Error;
