import * as React from 'react';

interface EmailTemplateProps {
  uid:string;
  content:string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  uid,content
}) => (
  <div>
    <h1>{uid}</h1>
    <p>{content}</p>
  </div>
);