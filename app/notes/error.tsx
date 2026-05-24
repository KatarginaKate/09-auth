'use client';

type Props = {
  error: Error;
};

const Error = ({ error }: Props) => {
  return (
    <div>
      <h2>Could not fetch the list of notes.</h2>
      <p>{error.message}</p>
    </div>
  );
}

export default Error;
