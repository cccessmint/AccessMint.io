import { createSupabaseServerClient } from '@/lib/supabaseServerClient';
import { redirect } from 'next/navigation';

export default async function DeployLogsPage() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const { data: logs, error } = await supabase
    .from('deployment_logs')
    .select('id, campaign_name, contract_address, deploy_status, log_message, created_at')
    .eq('created_by', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return <div>Error loading logs: {error.message}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-6">Deployment Logs</h1>

      {logs.length === 0 ? (
        <p>No deployment logs found.</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Campaign</th>
              <th className="p-2 border">Contract</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Message</th>
              <th className="p-2 border">Created At</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log: any) => (
              <tr key={log.id} className="border-b">
                <td className="p-2 border">{log.campaign_name}</td>
                <td className="p-2 border">
                  {log.contract_address ? (
                    <a
                      href={`https://polygonscan.com/address/${log.contract_address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {log.contract_address.slice(0, 6)}...{log.contract_address.slice(-4)}
                    </a>
                  ) : (
                    'N/A'
                  )}
                </td>
                <td className="p-2 border">{log.deploy_status}</td>
                <td className="p-2 border">{log.log_message}</td>
                <td className="p-2 border">{new Date(log.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

