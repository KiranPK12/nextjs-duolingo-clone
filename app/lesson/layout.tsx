type Props = {
  children: React.ReactNode;
};

const LessonLayout = ({ children }: Props) => {
  return (
    <div className="flex flex-col h-full">
      <div className="w-full h-full flex flex-col">{children}</div>
    </div>
  );
};

export default LessonLayout;
