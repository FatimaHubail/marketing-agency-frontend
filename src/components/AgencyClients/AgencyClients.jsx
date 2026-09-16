import { useEffect, useState } from "react";
import { getClients } from "../../services/clientService";
import "./AgencyClients.css";

const AgencyClients = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const data = await getClients();
        setClients(data);
      } catch (err) {
        console.log(err);
      }
    };

    loadClients();
  }, []);

  return (
    <div className="agency-clients">
      <h1>Clients</h1>

      {clients.length === 0 ? (
        <p>No clients found.</p>
      ) : (
        <div className="clients-container">
          {clients.map((client) => (
            <div className="client-card" key={client._id}>
              <h2>{client.companyName}</h2>

              <p>Industry: {client.industry}</p>

              <p>Contact Person: {client.contactPerson}</p>

              <p>Email: {client.contactEmail}</p>

              <p>Phone: {client.contactPhone}</p>

              <p>Budget: {client.budgetTier}</p>

              <p>
                Location: {client.address?.area},{" "}
                {client.address?.governorate}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgencyClients;