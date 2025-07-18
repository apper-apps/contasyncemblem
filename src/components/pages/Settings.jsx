import React, { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import { toast } from "react-toastify";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({
    name: "Contabil Principal",
    email: "contabil@contasync.ro",
    phone: "0721234567",
    company: "Cabinet Contabil XYZ"
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    documentAlerts: true,
    messageAlerts: true
  });

  const tabs = [
    { id: "profile", label: "Profil", icon: "User" },
    { id: "notifications", label: "Notificări", icon: "Bell" },
    { id: "security", label: "Securitate", icon: "Shield" },
    { id: "preferences", label: "Preferințe", icon: "Settings" }
  ];

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    toast.success("Profilul a fost actualizat cu succes!");
  };

  const handleNotificationUpdate = (key, value) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
    toast.success("Preferințele de notificare au fost actualizate!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Setări</h1>
        <p className="text-gray-600">Gestionează setările contului și preferințele</p>
      </div>

      {/* Tabs */}
      <Card className="p-0">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <ApperIcon name={tab.icon} size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "profile" && (
            <div className="max-w-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Informații Profil
              </h3>
              
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Nume complet"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    required
                  />
                  <FormField
                    label="Email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    required
                  />
                  <FormField
                    label="Telefon"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  />
                  <FormField
                    label="Companie"
                    value={profile.company}
                    onChange={(e) => setProfile({...profile, company: e.target.value})}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit">
                    <ApperIcon name="Save" size={16} className="mr-2" />
                    Salvează modificările
                  </Button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="max-w-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Preferințe Notificări
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Notificări Email</p>
                    <p className="text-sm text-gray-600">Primește notificări prin email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={notifications.emailNotifications}
                      onChange={(e) => handleNotificationUpdate("emailNotifications", e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Notificări SMS</p>
                    <p className="text-sm text-gray-600">Primește notificări prin SMS</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={notifications.smsNotifications}
                      onChange={(e) => handleNotificationUpdate("smsNotifications", e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Alerte Documente</p>
                    <p className="text-sm text-gray-600">Notificări pentru documente noi</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={notifications.documentAlerts}
                      onChange={(e) => handleNotificationUpdate("documentAlerts", e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Alerte Mesaje</p>
                    <p className="text-sm text-gray-600">Notificări pentru mesaje noi</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={notifications.messageAlerts}
                      onChange={(e) => handleNotificationUpdate("messageAlerts", e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="max-w-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Securitate
              </h3>
              
              <div className="space-y-6">
                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Schimbă parola</p>
                      <p className="text-sm text-gray-600">Actualizează parola contului</p>
                    </div>
                    <Button variant="outline">
                      <ApperIcon name="Key" size={16} className="mr-2" />
                      Schimbă parola
                    </Button>
                  </div>
                </Card>

                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Autentificare în doi pași</p>
                      <p className="text-sm text-gray-600">Adaugă un nivel suplimentar de securitate</p>
                    </div>
                    <Button variant="outline">
                      <ApperIcon name="Shield" size={16} className="mr-2" />
                      Activează 2FA
                    </Button>
                  </div>
                </Card>

                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Sesiuni active</p>
                      <p className="text-sm text-gray-600">Gestionează sesiunile active</p>
                    </div>
                    <Button variant="outline">
                      <ApperIcon name="Monitor" size={16} className="mr-2" />
                      Vezi sesiunile
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="max-w-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Preferințe Aplicație
              </h3>
              
              <div className="space-y-6">
                <FormField
                  label="Limbă"
                  type="select"
                  defaultValue="ro"
                  options={[
                    { value: "ro", label: "Română" },
                    { value: "en", label: "English" }
                  ]}
                />

                <FormField
                  label="Fus orar"
                  type="select"
                  defaultValue="Europe/Bucharest"
                  options={[
                    { value: "Europe/Bucharest", label: "Europa/București" },
                    { value: "Europe/London", label: "Europa/Londra" },
                    { value: "America/New_York", label: "America/New York" }
                  ]}
                />

                <FormField
                  label="Format dată"
                  type="select"
                  defaultValue="dd/MM/yyyy"
                  options={[
                    { value: "dd/MM/yyyy", label: "31/12/2024" },
                    { value: "MM/dd/yyyy", label: "12/31/2024" },
                    { value: "yyyy-MM-dd", label: "2024-12-31" }
                  ]}
                />

                <div className="flex justify-end">
                  <Button>
                    <ApperIcon name="Save" size={16} className="mr-2" />
                    Salvează preferințele
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default Settings;