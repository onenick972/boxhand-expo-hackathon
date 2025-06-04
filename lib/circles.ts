import { supabase } from './supabase';
import { deployCircleContract } from './algorand';

export async function createCircle(
  name: string,
  description: string,
  contributionAmount: number,
  frequency: string,
  memberEmails: string[]
) {
  try {
    // 1. Create the circle in the database
    const { data: circle, error: circleError } = await supabase
      .from('circles')
      .insert([
        {
          name,
          description,
          contribution_amount: contributionAmount,
          frequency,
          total_pool: 0,
        }
      ])
      .select()
      .single();

    if (circleError) throw circleError;

    // 2. Add creator as admin
    const { error: memberError } = await supabase
      .from('circle_members')
      .insert([
        {
          circle_id: circle.id,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          role: 'admin',
        }
      ]);

    if (memberError) throw memberError;

    // 3. Send invitations to members
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email')
      .in('email', memberEmails);

    if (usersError) throw usersError;

    if (users && users.length > 0) {
      const memberInserts = users.map(user => ({
        circle_id: circle.id,
        user_id: user.id,
        role: 'member',
      }));

      const { error: inviteError } = await supabase
        .from('circle_members')
        .insert(memberInserts);

      if (inviteError) throw inviteError;
    }

    // 4. Deploy smart contract
    const contractAddress = await deployCircleContract(
      name,
      contributionAmount,
      frequency,
      [] // In production, add member wallet addresses
    );

    // 5. Update circle with contract address
    const { error: updateError } = await supabase
      .from('circles')
      .update({ contract_address: contractAddress })
      .eq('id', circle.id);

    if (updateError) throw updateError;

    return circle;
  } catch (error) {
    console.error('Failed to create circle:', error);
    throw error;
  }
}