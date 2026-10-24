import { useEffect } from "react";
import {
  findPublicClassName,
  loadPublicClasses,
  publicClassLabel,
} from "../services/publicClassCatalogService";

function optionsMatch(select, options) {
  const current = Array.from(select.options).slice(1);
  return current.length === options.length && current.every((option, index) =>
    option.value === options[index].value && option.textContent === options[index].label,
  );
}

function applyClasses(classes) {
  const select = document.getElementById("class-selection");
  if (!select || !classes.length) return false;

  const signature = classes.map((course) => `${course.id}:${course.startDate}:${course.registrationOpen}`).join("|");
  const options = classes.map((course) => ({ value: course.title, label: publicClassLabel(course) }));
  if (select.dataset.publicClassSignature === signature && optionsMatch(select, options)) return true;

  const current = select.value;
  const requested = new URLSearchParams(window.location.search).get("class");
  const requestedName = requested ? findPublicClassName(classes, requested) : "";
  const available = new Set(options.map((option) => option.value));
  const nextValue = available.has(current) ? current : available.has(requestedName) ? requestedName : "";

  select.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Select a class";
  select.appendChild(placeholder);

  options.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.value;
    option.textContent = item.label;
    select.appendChild(option);
  });

  select.value = nextValue;
  select.dataset.publicClassSignature = signature;
  if (nextValue) window.localStorage.setItem("exam-coach-class", nextValue);
  select.dispatchEvent(new Event("change", { bubbles: true }));
  return true;
}

export default function PublicClassSelectInjector() {
  useEffect(() => {
    let active = true;
    let classes = [];
    let observer = null;

    const sync = () => {
      if (!active || !classes.length) return;
      applyClasses(classes);
    };

    loadPublicClasses()
      .then((rows) => {
        if (!active) return;
        classes = rows;
        sync();
        observer = new MutationObserver(sync);
        observer.observe(document.body, { childList: true, subtree: true });
      })
      .catch(() => {});

    const timer = window.setInterval(sync, 1000);
    return () => {
      active = false;
      observer?.disconnect();
      window.clearInterval(timer);
    };
  }, []);

  return null;
}
