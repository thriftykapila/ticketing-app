import { React, useState } from "react";
import "./modal.css";
import Modal from "../Modal/Modal";

function AddNewAgentForm({
  filteredAgents,
  message,
  setMessage,
  agents,
  setAgents,
}) {
  const [showNewAgentForm, setShowNewAgentForm] = useState(false);
  const [newAgent, setNewAgent] = useState({
    id:
      agents.length > 0 ? Math.max(...agents.map((agent) => agent.id)) + 1 : 1,
    name: "",
    email: "",
    contact: "",
    leads: 0,
    status: "Away",
    lastLogin: "",
  });

  const handleNewAgentChange = (event) => {
    setMessage("");
    const { name, value } = event.target;
    if (name === "lastContacted") {
      const selectedDate = new Date(value);

      if (!isNaN(selectedDate.getTime())) {
        setNewAgent({ ...newAgent, lastContacted: value });
      } else {
        setNewAgent({ ...newAgent, lastContacted: "" });
      }
    } else {
      setNewAgent({ ...newAgent, [name]: value });
    }
  };

  const addnewAgent = (e) => {
    e.preventDefault();

    const nextAgentId =
      agents.length > 0 ? Math.max(...agents.map((agent) => agent.id)) + 1 : 1;
    newAgent.id = nextAgentId;
    if (
      !newAgent.name ||
      !newAgent.email ||
      !newAgent.contact ||
      newAgent.lastLogin === "NaN/NaN/NaN"
    ) {
      setMessage("Please fill in all required fields.");
      return;
    }

    const updatedAgents = [...agents, newAgent];
    setAgents(updatedAgents);
    setShowNewAgentForm(false);
    setNewAgent({
      id: nextAgentId + 1,
      name: "",
      email: "",
      contact: "",
      priority: "P0",
      status: "Pending",
      lastContacted: "",
      agentAssigned: "Agent 1",
    });
    setMessage("");
  };

  return (
    <div>
      <button className="addBtn" onClick={() => setShowNewAgentForm(true)}>
        Add new Agent
      </button>

      <Modal showModal={showNewAgentForm} setShowModal={setShowNewAgentForm}>
        <div>
          <h2>Add New Agent</h2>
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
                    value={newAgent.name}
                    onChange={handleNewAgentChange}
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
                    value={newAgent.email}
                    onChange={handleNewAgentChange}
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
                  value={newAgent.contact}
                  onChange={handleNewAgentChange}
                />
              </div>
            </label>
            <div className="fGroup">
              <label className="formInput">
                Status:
                <div>
                  <select
                    name="status"
                    value={newAgent.status}
                    onChange={handleNewAgentChange}
                  >
                    <option value="Away">Away</option>
                    <option value="Live">Live</option>
                  </select>
                </div>
              </label>
            </div>

            <label className="formInput">
              Last Login
              <div>
                <input
                  required
                  type="date"
                  name="lastLogin"
                  value={newAgent.lastLogin}
                  onChange={handleNewAgentChange}
                />
              </div>
            </label>

            <div className="formBtns">
              <button
                type="submit"
                className="submitBtn"
                onClick={(e) => addnewAgent(e)}
              >
                Submit
              </button>
              <button
                className="submitBtn"
                onClick={() => {
                  setShowNewAgentForm(false);
                  setMessage("");
                }}
              >
                Cancel
              </button>
            </div>
            <div>{message}</div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default AddNewAgentForm;
