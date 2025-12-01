function App() {
    const [formData, setFormData] = React.useState({
        name: "",
        email: "",
        favCity: "",
        theme: "light",
    });

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        alert("Submitted:\n" + JSON.stringify(formData, null, 2));
    }

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center">
            <div className="card shadow-lg w-100" style={{ maxWidth: "480px" }}>
                <div className="card-body p-4">
                    <h1 className="h4 mb-3 text-center">Styled React Form</h1>
                    <p className="text-muted small text-center mb-4">
                        Simple React + CDN setup with Bootstrap themed inputs and dropdowns.
                    </p>

                    <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">
                                Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                className="form-control"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Jane Doe"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className="form-control"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="jane@example.com"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="favCity" className="form-label">
                                Favourite city
                            </label>
                            <select
                                id="favCity"
                                name="favCity"
                                className="form-select"
                                value={formData.favCity}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Choose…</option>
                                <option value="manchester">Manchester</option>
                                <option value="london">London</option>
                                <option value="paris">Paris</option>
                                <option value="tokyo">Tokyo</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="theme" className="form-label">
                                UI theme preference
                            </label>
                            <select
                                id="theme"
                                name="theme"
                                className="form-select"
                                value={formData.theme}
                                onChange={handleChange}
                            >
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                                <option value="solar">Solar</option>
                            </select>
                        </div>

                        <button type="submit" className="btn btn-primary w-100">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
