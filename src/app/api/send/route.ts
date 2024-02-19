import { EmailTemplate } from '@/components/email-template';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend("re_RCvPwyfs_Jnx5xQUuZZ5jih4zoq8RBRwA");

export async function POST(request:Request) {
    const {content,email} = await request.json();
  try {
    const {data,error} = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['shiro-kwsm-46@docomo.ne.jp'],
      subject: 'お問い合わせ',
      react: EmailTemplate({email,content}) as React.ReactElement
    });
    if(error){
        return NextResponse.json({error}); 
    }

    return NextResponse.json({data});
  } catch (error) {
    return Response.json({ error });
  }
}
