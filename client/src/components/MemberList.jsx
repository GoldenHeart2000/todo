import { useBoardStore } from '../stores/boardStore.js';
import { useAuth } from '../hooks/useAuth.js';

export const MemberList = () => {
  const { members, removeMember, activeProject } = useBoardStore();
  const { user } = useAuth();

  const handleRemoveMember = async (memberId) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      try {
        await removeMember(activeProject.id, memberId);
      } catch (error) {
        console.error('Error removing member:', error);
      }
    }
  };

  const canManageMembers = () => {
    if (!activeProject || !user) return false;
    const userRole = members.find(m => m.user.id === user.id)?.role;
    return userRole === 'creator' || userRole === 'admin';
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900">Project Members</h3>
      <div className="space-y-2">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <img
                src={member.user.avatar || '/default-avatar.png'}
                alt={member.user.name}
                className="h-8 w-8 rounded-full"
              />
              <div>
                <p className="font-medium text-gray-900">
                  {member.user.name}
                </p>
                <p className="text-sm text-gray-500">
                  {member.user.email}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                member.role === 'creator' 
                  ? 'bg-purple-100 text-purple-700'
                  : member.role === 'admin'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {member.role}
              </span>
              
              {canManageMembers() && member.role !== 'creator' && (
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
