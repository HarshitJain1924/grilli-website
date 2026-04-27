
        // --- BASIC PASS PROTECTION ---
        const PASS = "admin123";
        function authenticate() {
            const userInput = prompt("Enter Admin Password:");
            if (userInput === PASS) {
                document.body.style.display = "block";
                fetchReservations();
            } else {
                alert("Incorrect Password! Access Denied.");
                window.location.href = "index.html";
            }
        }

        function logout() {
            window.location.href = "index.html";
        }

        // --- DATA FETCHING ---
        const API_BASE_URL = '/api';

        async function fetchReservations() {
            const root = document.getElementById('reservations-root');
            try {
                const res = await fetch(API_BASE_URL + '/admin/reservations');
                const data = await res.json();
                const root = document.getElementById('reservations-root');

                if (!Array.isArray(data)) {
                    root.innerHTML = `<div class="loading" style="color: #ff6b6b;">❗ Error: ${data.error || 'Server returned invalid data'}</div>`;
                    return;
                }

                if (data.length === 0) {
                    root.innerHTML = '<div class="loading" style="color: #d1d1d1;">No reservations found yet.</div>';
                    return;
                }

                let html = `
                    <table class="res-table">
                        <thead>
                            <tr>
                                <th>Booking Time</th>
                                <th>Customer Name</th>
                                <th>Guests</th>
                                <th>Contact Details</th>
                                <th>Special Message</th>
                                <th>Received At</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                    data.forEach(r => {
                        const receivedAt = new Date(r.createdAt).toLocaleString();
                        const dateVal = r.date || r["reservation-date"] || "N/A";
                        const timeVal = r.time || "N/A";

                        html += `
                        <tr>
                            <td><strong>${dateVal}</strong><br><span style="font-size: 0.9rem; color: #aaa;">at ${timeVal}</span></td>
                            <td>${r.name}</td>
                            <td><span class="status-badge">${r.person || '1'}</span></td>
                            <td>${r.phone}</td>
                            <td><span class="msg-text">${r.message || '-'}</span></td>
                            <td style="font-size: 0.9rem; opacity: 0.7;">${receivedAt}</td>
                        </tr>
                    `;
                    });

                    html += '</tbody></table>';
                    root.innerHTML = html;

                } catch (err) {
                    console.error(err);
                    root.innerHTML = '<div class="error">Failed to load reservations. Check console.</div>';
                }
            }

        async function clearAllReservations() {
                if (confirm("🚨 DANGER: Are you sure you want to delete ALL booking data permanently?")) {
                    try {
                        const response = await fetch(API_BASE_URL + '/admin/reservations', {
                            method: 'DELETE'
                        });

                        if (response.ok) {
                            alert("Database wiped clean 🧼");
                            fetchReservations(); // Refresh the table
                        } else {
                            alert("Error wiping database.");
                        }
                    } catch (err) {
                        console.error(err);
                        alert("Network error.");
                    }
                }
            }

            // Start authentication
            authenticate();
    