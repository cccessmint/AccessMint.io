import { createSupabaseServerClient } from '@/lib/supabaseServerClient'
import { redirect } from 'next/navigation'
import WalletConnect from '@/components/WalletConnect'
import TicketPreview from '@/components/TicketPreview'

export default async function MyMintsPage() {
  const supabase = createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // Dohvaćamo korisnikov wallet_address iz Supabase users tablice:
  const { data: userProfile, error: profileError } = await supabase
    .from('users')
    .select('wallet_address')
    .eq('id', user.id)
    .single()

  // Osiguraj da je userProfile pravi objekt
  const walletAddress =
    userProfile && typeof userProfile === 'object' && 'wallet_address' in userProfile
      ? userProfile.wallet_address
      : null

  if (profileError || !walletAddress) {
    return (
      <div className="p-4">
        <h1 className="text-2xl mb-6">My Minted NFTs</h1>
        <p className="text-red-500">Nije moguće dohvatiti tvoj profil.</p>
      </div>
    )
  }

  const { data: mints, error: mintsError } = await supabase
    .from('mints')
    .select('id, wallet_address, campaign_id, minted_at, tx_hash, campaigns(name)')
    .eq('wallet_address', walletAddress)

  if (mintsError) {
    return <div>Error loading your mints: {mintsError.message}</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-6">My Minted NFTs</h1>

      {mints.length === 0 ? (
        <p>You have not minted any NFTs yet.</p>
      ) : (
        <>
          <table className="w-full border mb-8">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">Campaign</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Tx Hash</th>
              </tr>
            </thead>
            <tbody>
              {mints.map((mint: any) => (
                <tr key={mint.id} className="border-b">
                  <td className="p-2 border">{mint.campaigns?.name}</td>
                  <td className="p-2 border">
                    {new Date(mint.minted_at).toLocaleString()}
                  </td>
                  <td className="p-2 border">
                    <a
                      href={`https://polygonscan.com/tx/${mint.tx_hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View Tx
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Prikaz karte za prvu kampanju */}
          <TicketPreview
            wallet={walletAddress}
            campaign={mints[0]?.campaigns?.name || 'Unknown'}
          />
        </>
      )}
    </div>
  )
}

