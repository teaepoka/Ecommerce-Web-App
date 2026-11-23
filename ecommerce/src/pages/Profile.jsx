import { useEffect, useState } from "react";
import { getProfile, updateBalance } from "../api/users";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not load your profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAddMoney = async (e) => {
    e.preventDefault();

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setMessage("Please enter an amount greater than 0.");
      return;
    }

    setUpdating(true);
    setMessage("");
    setError("");

    try {
      await updateBalance(numericAmount);

      await fetchProfile();

      setAmount("");
      setMessage("Money added successfully!");
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          err.message ||
          "Could not update your balance.",
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-status">
        <p>LOADING YOUR PROFILE...</p>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="profile-status profile-error">
        <p>{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-status">
        <p>Profile not found.</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-heading">
        <p className="profile-label">USER DASHBOARD</p>
        <h1>
          MY <span>PROFILE</span>
        </h1>
        <p className="profile-subtitle">Manage your account and wallet.</p>
      </div>

      <div className="profile-grid">
        <section className="profile-card personal-card">
          <div className="profile-card-heading">
            <span className="profile-icon">◈</span>
            <div>
              <p className="profile-card-label">ACCOUNT</p>
              <h2>Personal Information</h2>
            </div>
          </div>

          <div className="profile-info">
            <div className="profile-info-row">
              <span>USERNAME</span>
              <strong>{profile.username}</strong>
            </div>

            <div className="profile-info-row">
              <span>EMAIL ADDRESS</span>
              <strong>{profile.email}</strong>
            </div>
          </div>
        </section>

        <section className="profile-card wallet-card">
          <div className="profile-card-heading">
            <span className="profile-icon pink-icon">₳</span>
            <div>
              <p className="profile-card-label">YOUR FUNDS</p>
              <h2>Digital Wallet</h2>
            </div>
          </div>

          <div className="wallet-balance">
            <p>CURRENT BALANCE</p>
            <strong>
              {Number(profile.walletBalance).toLocaleString("sq-AL")} ALL
            </strong>
          </div>

          <form onSubmit={handleAddMoney} className="wallet-form">
            <label htmlFor="amount">ADD FUNDS (ALL)</label>

            <input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Enter amount..."
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            <button type="submit" disabled={updating}>
              {updating ? "ADDING FUNDS..." : "ADD MONEY"}
            </button>
          </form>

          {message && (
            <p
              className={
                message === "Money added successfully!"
                  ? "profile-success"
                  : "profile-message"
              }
            >
              {message}
            </p>
          )}
        </section>

        <section className="profile-card statistics-card">
          <div className="profile-card-heading">
            <span className="profile-icon">⌁</span>
            <div>
              <p className="profile-card-label">ACCOUNT ACTIVITY</p>
              <h2>Statistics</h2>
            </div>
          </div>

          <div className="statistics-grid">
            <div className="stat-box">
              <strong>{profile.productsSold}</strong>
              <span>PRODUCTS SOLD</span>
            </div>

            <div className="stat-box">
              <strong>{profile.productsBought}</strong>
              <span>PRODUCTS BOUGHT</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Profile;
