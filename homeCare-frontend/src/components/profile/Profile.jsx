import { Button } from "../ui/Button.jsx";
  import { Card } from "../ui/Card.jsx";
  import { Field } from "../ui/Field.jsx";
  import { titleCase } from "../../lib/format.js";

  export function Profile({ role, loading, submitProfile, userInfo, isUpdate, services = [] }) {
    const selectedSkills = new Set((userInfo?.skills || []).map((skill) => String(skill || "").toLowerCase()));
    const serviceOptions = Array.from(
      new Map(
        services
          .map((service) => String(service.categoryName || "").trim().toLowerCase())
          .filter(Boolean)
          .map((serviceName) => [serviceName, serviceName]),
      ).values(),
    );

    return (
      <main className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-lg p-8">
          <h2 className="text-2xl font-bold text-slate-900">
            {isUpdate ? "Update Profile" : (role === "agent" ? "Agent profile" : "Customer profile")}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {isUpdate ? "Update your profile information." : "Complete your profile to continue using HomeCare."}
          </p>
          <form className="mt-6 grid gap-4" onSubmit={submitProfile}>
            <Field label="Full name">
              <input name="fullName" required defaultValue={userInfo?.fullName || ""} />
            </Field>
            <Field label="Email">
              <input type="email" name="email" defaultValue={userInfo?.email || ""} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Gender">
                <select name="gender" required defaultValue={userInfo?.gender || "male"}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="others">Others</option>
                </select>
              </Field>
              <Field label="Date of birth">
                <input type="date" name="dob" defaultValue={userInfo?.dob || ""} />
              </Field>
            </div>
            {role === "agent" && (
              <div>
                <span className="text-sm font-semibold text-slate-700">Services you can handle</span>
                <div className="mt-2 grid max-h-52 gap-2 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-3 sm:grid-cols-2">
                  {serviceOptions.length ? (
                    serviceOptions.map((serviceName) => (
                      <label key={serviceName} className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                        <input
                          type="checkbox"
                          name="skills"
                          value={serviceName}
                          defaultChecked={selectedSkills.has(serviceName)}
                          className="h-4 w-4 accent-orange-600"
                        />
                        <span>{titleCase(serviceName)}</span>
                      </label>
                    ))
                  ) : (
                    <p className="col-span-full text-sm text-slate-500">No approved services available yet.</p>
                  )}
                </div>
              </div>
            )}
            <Button variant="primary" disabled={loading} type="submit">
              {isUpdate ? "Update profile" : "Save profile"}
            </Button>
          </form>
        </Card>
      </main>
    );
  }
  
