'use client'
import { api } from '~/trpc/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
const Panel: React.FC = () => {
  const router = useRouter();
  const { data, isLoading: postsLoading } = api.auth.validateToken.useQuery();
    
  useEffect(() => {
    if (data?.auth == false) {
      router.push("/login");
    }
  });
  return (<p> protected </p>)}

export default Panel;
 
