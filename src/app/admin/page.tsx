import AdminCreateCampaignForm from '@/components/AdminCreateCampaignForm';
import CreateCampaignForm from '@/components/CreateCampaignForm';

export default function AdminPage() {
  return (
    <>
      <AdminCreateCampaignForm />
      <div className="p-4">
        <h1 className="text-2xl mb-4">Admin Dashboard</h1>
        <CreateCampaignForm />
      </div>
    </>
  );
}

