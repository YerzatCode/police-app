import React, { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import "./IncidentMap.css";

// 📌 Кастомная иконка для инцидентов
const incidentIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

// 📌 Компонент для плавного перемещения по карте
const JumpToMarker = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 14);
    }
  }, [position, map]);
  return null;
};

const IncidentMap = () => {
  const [incidents, setIncidents] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [filter, setFilter] = useState(["open", "in_progress"]); // 🔹 Начальный фильтр (без "closed")

  // 🔹 Загружаем инциденты
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/operator/incidents/")
      .then((response) => setIncidents(response.data.incidents.reverse()))
      .catch((error) => console.error("Ошибка загрузки инцидентов:", error));
  }, []);

  // ✅ Фильтруем и обрабатываем инциденты через useMemo
  const processedIncidents = useMemo(() => {
    return incidents
      .filter((incident) => filter.includes(incident.status)) // 🔹 Фильтр по статусу
      .map((incident) => {
        let images = [];
        try {
          let parsed = JSON.parse(incident.images);
          if (typeof parsed === "string") {
            images = [parsed.replace(/^"|"$/g, "")];
          } else if (Array.isArray(parsed)) {
            images = parsed.map((img) => img.replace(/^"|"$/g, ""));
          }
        } catch {
          images = [];
        }

        return { ...incident, images };
      });
  }, [incidents, filter]);

  // 🔹 Функция для изменения статуса инцидента
  const updateStatus = async (incidentID, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:8080/api/operator/incidents/${incidentID}`,
        { status: newStatus }
      );

      // 🔄 Обновляем локальное состояние
      setIncidents((prevIncidents) =>
        prevIncidents.map((incident) =>
          incident.ID === incidentID
            ? { ...incident, status: newStatus }
            : incident
        )
      );
    } catch (error) {
      console.error("Ошибка обновления статуса:", error);
    }
  };

  // 🔹 Обновляем фильтр
  const toggleFilter = (status) => {
    setFilter((prevFilter) =>
      prevFilter.includes(status)
        ? prevFilter.filter((s) => s !== status)
        : [...prevFilter, status]
    );
  };

  return (
    <div className="incident-container">
      {/* 📌 Фильтрация */}
      <section className="filter-section">
        <h3>🔍 Фильтр по статусу</h3>
        <label>
          <input
            type="checkbox"
            checked={filter.includes("open")}
            onChange={() => toggleFilter("open")}
          />
          Открытые
        </label>
        <label>
          <input
            type="checkbox"
            checked={filter.includes("in_progress")}
            onChange={() => toggleFilter("in_progress")}
          />
          В работе
        </label>
        <label>
          <input
            type="checkbox"
            checked={filter.includes("closed")}
            onChange={() => toggleFilter("closed")}
          />
          Закрытые
        </label>
      </section>

      {/* 📌 Левая панель со списком инцидентов */}
      <div className="incident-list">
        <h3>📌 Инциденты</h3>
        {processedIncidents.map((incident) => (
          <div
            key={incident.ID}
            onClick={() =>
              setSelectedPosition([incident.latitude, incident.longitude])
            }
            className="incident-item"
          >
            <strong>{incident.title}</strong>
            <p>{incident.description}</p>
            <small>{new Date(incident.CreatedAt).toLocaleString()}</small>

            {/* 🔹 Выбор нового статуса */}
            <select
              className="status-select"
              value={incident.status}
              onChange={(e) => updateStatus(incident.ID, e.target.value)}
            >
              <option value="open">Открыто</option>
              <option value="in_progress">В работе</option>
              <option value="closed">Закрыто</option>
            </select>
          </div>
        ))}
      </div>

      {/* 📌 Карта */}
      <MapContainer
        center={[51.1694, 71.4491]}
        zoom={10}
        className="leaflet-container"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a> contributors'
        />

        {/* 🔹 Перемещение к маркеру при клике в списке */}
        {selectedPosition && <JumpToMarker position={selectedPosition} />}

        {/* 🔹 Маркеры инцидентов */}
        {processedIncidents.map((incident) => (
          <Marker
            key={incident.ID}
            position={[incident.latitude, incident.longitude]}
            icon={incidentIcon}
          >
            <Popup>
              <strong>{incident.title}</strong>
              <p>{incident.description}</p>
              <p>
                <b>Статус:</b> {incident.status}
              </p>
              {incident.images.length > 0 ? (
                incident.images.map((image, index) => (
                  <img
                    key={index}
                    src={`http://localhost:8080/${image}`}
                    alt="incident"
                    className="incident-image"
                  />
                ))
              ) : (
                <p>Нет изображений</p>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default IncidentMap;
