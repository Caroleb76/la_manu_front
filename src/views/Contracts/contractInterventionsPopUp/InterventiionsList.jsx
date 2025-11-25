import { useEffect, useState } from "react"
import interventionsHelper from "../../../helpers/interventionsHelper"

const InterventionsList = ({ contractId }) => {
    const [interventions, setInterventions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getInterventions() {
            try {
                setLoading(true);
                const response = await interventionsHelper.getInterventionsByContractId(contractId);
                // Handle different response formats
                const data = response?.data || response || [];
                setInterventions(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching interventions:", error);
                setInterventions([]);
            } finally {
                setLoading(false);
            }
        }
        getInterventions();
    }, [contractId]);

    if (loading) {
        return <div className="flex justify-center items-center p-8">
            <p className="text-gray-500">Chargement...</p>
        </div>
    }

    if (!interventions.length) {
        return <div className="flex justify-center items-center p-8">
            <p className="text-gray-500">Aucune intervention trouvée</p>
        </div>
    }

    return (
        <div className="w-full">
            {/* Table */}
            <div className="overflow-x-auto">
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #d1d5db' }}>
    <thead>
        <tr style={{ backgroundColor: '#f9fafb' }}>
            <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '14px', fontWeight: '500', color: '#f97316', border: '1px solid #d1d5db' }}>
                Date
            </th>
            <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '14px', fontWeight: '500', color: '#f97316', border: '1px solid #d1d5db' }}>
                Module
            </th>
            <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '14px', fontWeight: '500', color: '#f97316', border: '1px solid #d1d5db' }}>
                Horaire
            </th>
            <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '14px', fontWeight: '500', color: '#f97316', border: '1px solid #d1d5db' }}>
                Durée
            </th>
            <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '14px', fontWeight: '500', color: '#f97316', border: '1px solid #d1d5db' }}>
                Catégorie
            </th>
            <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '14px', fontWeight: '500', color: '#f97316', border: '1px solid #d1d5db' }}>
                Description
            </th>
            <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '14px', fontWeight: '500', color: '#f97316', border: '1px solid #d1d5db' }}>
                Validé Formateur
            </th>
        </tr>
    </thead>
    <tbody style={{ backgroundColor: 'white' }}>
        {interventions.map((intervention, index) => (
            <tr 
                key={intervention.id || index}
                style={{ transition: 'background-color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1f2937', border: '1px solid #d1d5db' }}>
                    {new Date(intervention.dateIntervention).toLocaleDateString('fr-FR')}
                </td>
                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1f2937', border: '1px solid #d1d5db' }}>
                    {intervention.ModuleFormation?.name || '-'}
                </td>
                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1f2937', border: '1px solid #d1d5db' }}>
                    {intervention.shift || '-'}
                </td>
                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1f2937', border: '1px solid #d1d5db' }}>
                    {intervention.hours}
                </td>
                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1f2937', border: '1px solid #d1d5db' }}>
                    {intervention.InterventionCategory?.name || '-'}
                </td>
                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#4b5563', border: '1px solid #d1d5db' }}>
                    <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={intervention.description}>
                        {intervention.description || '-'}
                    </div>
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'center', border: '1px solid #d1d5db' }}>
                    {intervention.validatedByFormateur ? (
                        <span style={{ display: 'inline-block', color: '#10b981', fontSize: '24px', lineHeight: '1' }}>✓</span>
                    ) : (
                        <span style={{ display: 'inline-block', color: '#ef4444', fontSize: '24px', lineHeight: '1' }}>✕</span>
                    )}
                </td>
            </tr>
        ))}
    </tbody>
</table>
            </div>
        </div>
    );
}

export default InterventionsList