import { useEffect, useState } from "react";
import "./App.css";
import data from "./data";
import Sidebar from "./components/Sidebar/Sidebar";
import Modal from "./components/Modal/Modal";
import AddNewAgentForm from "./components/Modal/AddNewAgentForm";
import EmailModal from "./components/EmailModal";
import Widget from "./components/Widget";

function App() {
  const [leads, setLeads] = useState(data.leads);
  const [currentPage, setCurrentPage] = useState("leads");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [agents, setAgents] = useState(data.agents);
  const [sortColumnLeads, setSortColumnLeads] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [sortDirectionLeads, setSortDirectionLeads] = useState("asc");
  const [sortColumnAgents, setSortColumnAgents] = useState(null);
  const [sortDirectionAgents, setSortDirectionAgents] = useState("asc");
  const [showNewLeadForm, setShowNewLeadForm] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const initialState = {
    id: leads.length > 0 ? Math.max(...leads.map((lead) => lead.id)) + 1 : 1,
    name: "",
    email: "",
    contact: "",
    priority: "P0",
    status: "Pending",
    lastContacted: "",
    agentAssigned: "Agent 1",
  };
  const [newLead, setNewLead] = useState(initialState);

  useEffect(() => {
    setSearchFilter("");
  }, [currentPage]);

  const handleSortLeads = (column) => {
    if (column === sortColumnLeads) {
      setSortDirectionLeads(sortDirectionLeads === "asc" ? "desc" : "asc");
    } else {
      setSortColumnLeads(column);
      setSortDirectionLeads("asc");
    }
  };

  const handleSortAgents = (column) => {
    if (column === sortColumnAgents) {
      setSortDirectionAgents(sortDirectionAgents === "asc" ? "desc" : "asc");
    } else {
      setSortColumnAgents(column);
      setSortDirectionAgents("asc");
    }
  };

  const renderSortIconLeads = (column) => {
    if (column === sortColumnLeads) {
      if (sortDirectionLeads === "asc") {
        return <span>&uarr;</span>;
      } else {
        return <span>&darr;</span>;
      }
    }
    return null;
  };

  const renderSortIconAgents = (column) => {
    if (column === sortColumnAgents) {
      if (sortDirectionAgents === "asc") {
        return <span>&uarr;</span>;
      } else {
        return <span>&darr;</span>;
      }
    }
    return null;
  };

  const onEdit = (lead) => {
    setIsEditing(true);
    setNewLead({ ...lead, Notes: lead.Notes });
    setShowNewLeadForm(true);
  };

  const handleNewLeadChange = (event) => {
    setMessage("");
    const { name, value } = event.target;
    if (name === "lastContacted") {
      const selectedDate = new Date(value);

      if (!isNaN(selectedDate.getTime())) {
        setNewLead({ ...newLead, lastContacted: value });
      } else {
        setNewLead({ ...newLead, lastContacted: "" });
      }
    } else {
      setNewLead({ ...newLead, [name]: value });
    }
  };

  const addNewLead = (e) => {
    e.preventDefault();

    const nextLeadId =
      leads.length > 0 ? Math.max(...leads.map((lead) => lead.id)) + 1 : 1;
    newLead.id = nextLeadId;
    if (
      !newLead.name ||
      !newLead.email ||
      !newLead.contact ||
      newLead.lastContacted === "NaN/NaN/NaN"
    ) {
      setMessage("Please fill in all required fields.");
      return;
    }

    const updatedLeads = [...leads, newLead];
    setLeads(updatedLeads);
    setShowNewLeadForm(false);
    setNewLead({
      id: nextLeadId + 1,
      name: "",
      email: "",
      contact: "",
      priority: "P0",
      status: "Pending",
      lastContacted: "",
      agentAssigned: "Agent 1",
      Notes: "",
    });
    setMessage("");
  };

  const editLead = (e) => {
    e.preventDefault();

    const nextLeadId =
      leads.length > 0 ? Math.max(...leads.map((lead) => lead.id)) + 1 : 1;
    if (
      !newLead.name ||
      !newLead.email ||
      !newLead.contact ||
      newLead.lastContacted === "NaN/NaN/NaN"
    ) {
      setMessage("Please fill in all required fields.");
      return;
    }

    const updatedLeads = leads.map((lead) => {
      if (lead.id === newLead.id) {
        return { ...newLead };
      } else return lead;
    });

    console.log(updatedLeads, "aa");

    setLeads(updatedLeads);
    setIsEditing(false);
    setShowNewLeadForm(false);
    setNewLead({
      id: nextLeadId + 1,
      name: "",
      email: "",
      contact: "",
      priority: "P0",
      status: "Pending",
      lastContacted: "",
      agentAssigned: "Agent 1",
      Notes: "",
    });
    setMessage("");
  };

  const handleSearchFilterChange = (event) => {
    setSearchFilter(event.target.value);
  };

  const filteredLeads = leads.filter((lead) =>
    lead.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const filteredAgents = agents.filter((agent) =>
    agent.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const onDelete = (id, agent = false) => {
    if (agent) {
      let agentFind = agents.filter((agent) => agent.id === id);

      let remainingLeads = totalNumberOfLeads(agentFind[0].name);

      if (remainingLeads > 0) {
        setMessage(
          `Agent ${id} have ${remainingLeads} leads remainig. Kindly assign it to someone else before you remove Agent ${id} `
        );
        setShowModal(true);
        return;
      }

      let currAgent = agents.filter((agent) => agent.id !== id);
      setAgents(currAgent);
      return;
    }

    let currLeads = leads.filter((lead) => lead.id !== id);
    setLeads(currLeads);
  };

  const handleAgentChange = (id, newAgent) => {
    const updatedLeads = leads.map((lead) => {
      if (lead.id === id) {
        return { ...lead, agentAssigned: newAgent };
      }
      return lead;
    });

    setLeads(updatedLeads);
  };

  const handleNotes = (e, id) => {
    const updatedLeads = leads.map((lead) => {
      if (lead.id === id) {
        return { ...lead, Notes: e.target.value };
      }
      return lead;
    });
    setLeads(updatedLeads);
  };

  const handleAgentStatusChange = (id, newAgentStatus) => {
    const updatedAgents = agents.map((agent) => {
      if (agent.id === id) {
        return { ...agent, status: newAgentStatus };
      }
      return agent;
    });

    setAgents(updatedAgents);
  };

  const handleStatusChange = (id, newStatus) => {
    const updatedLeads = leads.map((lead) => {
      if (lead.id === id) {
        return { ...lead, status: newStatus };
      }
      return lead;
    });
    setLeads(updatedLeads);
  };

  const handlePriorityChange = (id, newPriority) => {
    const updatedLeads = leads.map((lead) => {
      if (lead.id === id) {
        return { ...lead, priority: newPriority };
      }
      return lead;
    });
    setLeads(updatedLeads);
  };

  const totalNumberOfLeads = (name) => {
    let count = 0;
    for (let lead of leads) {
      if (lead.agentAssigned === name) {
        count++;
      }
    }
    return count;
  };

  const sortedLeads = filteredLeads.sort((a, b) => {
    if (sortColumnLeads) {
      const keyA = a[sortColumnLeads];
      const keyB = b[sortColumnLeads];
      if (sortDirectionLeads === "asc") {
        return keyA.localeCompare(keyB);
      } else {
        return keyB.localeCompare(keyA);
      }
    }
    return 0;
  });

  const sortedAgents = filteredAgents.sort((a, b) => {
    if (sortColumnAgents) {
      const keyA = a[sortColumnAgents];
      const keyB = b[sortColumnAgents];
      if (sortDirectionAgents === "asc") {
        return keyA.localeCompare(keyB);
      } else {
        return keyB.localeCompare(keyA);
      }
    }
    return 0;
  });

  return (
    <div className="main">
      <div className="left">
        <Sidebar setCurrentPage={setCurrentPage} />
      </div>
      <div className="right">
        {showModal && (
          <Modal
            showModal={showModal}
            setShowModal={setShowModal}
            setMessage={setMessage}
          >
            <div>{message}</div>
          </Modal>
        )}
        <div className="leadsTable">
          <h1>{currentPage}</h1>
          <input
            className="searchInput"
            type="text"
            placeholder={`Search ${currentPage}`}
            value={searchFilter}
            onChange={handleSearchFilterChange}
          />
        </div>

        {currentPage === "leads" && (
          <div className="leadsTable">
            {emailModal && (
              <EmailModal
                showModal={emailModal}
                setShowModal={setEmailModal}
                setMessage={setMessage}
              />
            )}
            <div className="widgets">
              <Widget type="user" />
              <Widget type="order" />
              <Widget type="earning" />
              <Widget type="balance" />
            </div>
            <button className="addBtn" onClick={() => setShowNewLeadForm(true)}>
              Add new Lead
            </button>

            <Modal
              showModal={showNewLeadForm}
              setShowModal={setShowNewLeadForm}
            >
              <div>
                <h2>Add New Lead</h2>
                <form className="form">
                  <div className="fGroup">
                    <label className="formInput">
                      Name:
                      <div>
                        <input
                          required
                          className="inputVal"
                          type="text"
                          name="name"
                          value={newLead.name}
                          onChange={handleNewLeadChange}
                        />
                      </div>
                    </label>
                    <label className="formInput">
                      Email:
                      <div>
                        <input
                          required
                          className="inputVal"
                          type="text"
                          name="email"
                          value={newLead.email}
                          onChange={handleNewLeadChange}
                        />
                      </div>
                    </label>
                  </div>
                  <label className="formInput">
                    Contact:
                    <div>
                      <input
                        required
                        className="inputVal"
                        type="number"
                        name="contact"
                        value={newLead.contact}
                        onChange={handleNewLeadChange}
                      />
                    </div>
                  </label>
                  <div className="fGroup">
                    <label className="formInput">
                      Priority:
                      <div>
                        <select
                          name="priority"
                          value={newLead.priority}
                          onChange={handleNewLeadChange}
                        >
                          <option value="P0">P0</option>
                          <option value="P1">P1</option>
                          <option value="P2">P2</option>
                        </select>
                      </div>
                    </label>

                    <label className="formInput">
                      Status:
                      <div>
                        <select
                          name="status"
                          value={newLead.status}
                          onChange={handleNewLeadChange}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </label>

                    <label className="formInput">
                      Agent
                      <div>
                        <select
                          name="agentAssigned"
                          value={newLead.agentAssigned}
                          onChange={handleNewLeadChange}
                        >
                          {filteredAgents.map((agent) => (
                            <option key={agent.id} value={`Agent ${agent.id}`}>
                              Agent {agent.id}
                            </option>
                          ))}
                        </select>
                      </div>
                    </label>
                  </div>

                  <label className="formInput">
                    Last Contacted:
                    <div>
                      <input
                        required
                        type="date"
                        name="lastContacted"
                        value={newLead.lastContacted}
                        onChange={handleNewLeadChange}
                      />
                    </div>
                  </label>

                  <label className="formInput">
                    Notes:
                    <div>
                      <textarea
                        className="textArea"
                        rows={5}
                        maxLength={200}
                        type="date"
                        name="Notes"
                        value={newLead.Notes}
                        onChange={handleNewLeadChange}
                      />
                    </div>
                  </label>

                  <div className="formBtns">
                    {!isEditing ? (
                      <button
                        type="submit"
                        className="submitBtn"
                        onClick={(e) => addNewLead(e)}
                      >
                        Submit
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="submitBtn"
                        onClick={(e) => editLead(e)}
                      >
                        Edit
                      </button>
                    )}
                    <button
                      className="submitBtn"
                      onClick={() => {
                        setShowNewLeadForm(false);
                        setMessage("");
                        setIsEditing(false);
                        setNewLead(initialState);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                  <div>{message}</div>
                </form>
              </div>
            </Modal>

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th onClick={() => handleSortLeads("name")}>
                    Name {renderSortIconLeads("name")}
                  </th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th onClick={() => handleSortLeads("lastContacted")}>
                    Last Contacted
                  </th>
                  <th>Agent Assigned</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              {}{" "}
              <tbody>
                {sortedLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td>{lead.id}</td>
                    <td>
                      <div className="username">
                        <div className="avatar">{lead.name[0]}</div>
                        <div>{lead.name}</div>
                      </div>
                    </td>
                    <td>{lead.email}</td>
                    <td>{lead.contact}</td>
                    <td>
                      <select
                        name="priority"
                        value={lead.priority}
                        onChange={(e) =>
                          handlePriorityChange(lead.id, e.target.value)
                        }
                      >
                        <option value="P0">P0</option>
                        <option value="P1">P1</option>
                        <option value="P2">P2</option>
                      </select>
                    </td>
                    <td>
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          handleStatusChange(lead.id, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td>{lead.lastContacted}</td>
                    <td>
                      <select
                        value={lead.agentAssigned}
                        onChange={(e) =>
                          handleAgentChange(lead.id, e.target.value)
                        }
                      >
                        {filteredAgents.map((agent) => (
                          <option key={agent.id} value={`Agent ${agent.id}`}>
                            Agent {agent.id}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <textarea
                        style={{ resize: "none" }}
                        value={lead.Notes}
                        onChange={(e) => handleNotes(e, lead.id)}
                      />
                    </td>
                    <td>
                      <div className="btns">
                        <button
                          className="btn1"
                          onClick={() => setEmailModal(true)}
                        >
                          Generate Email
                        </button>
                        <button className="btn1" onClick={() => onEdit(lead)}>
                          Edit
                        </button>
                        <button
                          className="btn1"
                          onClick={() => onDelete(lead.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredLeads.length === 0 && (
              <div className="no__data">No data found!</div>
            )}
          </div>
        )}
        {currentPage === "agents" && (
          <div className="leadsTable">
            <AddNewAgentForm
              filteredAgents={filteredAgents}
              message={message}
              setMessage={setMessage}
              agents={agents}
              setAgents={setAgents}
            />
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th onClick={() => handleSortAgents("name")}>
                    Name {renderSortIconAgents("name")}
                  </th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th># of Leads</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedAgents.map((agent) => (
                  <tr key={agent.id}>
                    <td>{agent.id}</td>
                    <td>
                      <div className="username">
                        <div className="avatar">{agent.name[0]}</div>
                        <div>{agent.name}</div>
                      </div>
                    </td>
                    <td>{agent.email}</td>
                    <td>{agent.contact}</td>
                    <td>{totalNumberOfLeads(agent.name)}</td>

                    <td>
                      <select
                        value={agent.status}
                        onChange={(e) =>
                          handleAgentStatusChange(agent.id, e.target.value)
                        }
                      >
                        <option value="Away">Away</option>
                        <option value="Live">Live</option>
                      </select>
                    </td>

                    <td>{agent.lastLogin}</td>

                    <td>
                      <div className="btns">
                        <button
                          className="btn1"
                          onClick={() => onDelete(agent.id, true)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredAgents.length === 0 && (
              <div className="no__data">No data found!</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
