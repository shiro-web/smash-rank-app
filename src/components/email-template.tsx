import * as React from 'react';

interface EmailTemplateProps {
  email:string;
  content:string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  email,content
}) => (
  <div>
    <h1>{email}</h1>
    <p>{content}</p>
  </div>
);