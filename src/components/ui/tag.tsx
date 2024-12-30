import React from "react";

interface IProps {
  text: string;
}

export default function Tag(props: IProps) {
  const { text } = props;

  return (
    <div className="flex">
      <div className="app_category_tag">
        <p className="app_category_tag__text">{text}</p>
      </div>
    </div>
  );
}
