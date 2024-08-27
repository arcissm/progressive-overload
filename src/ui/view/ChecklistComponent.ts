
export class ChecklistComponent {


	render(container: HTMLElement) {
		container.createEl("h3", { text: "Checklist" });

		const items = [
			{ id: 1, label: "Item 1", checked: false },
			{ id: 2, label: "Item 2", checked: true },
			{ id: 3, label: "Item 3", checked: false },
		];

		items.forEach((item) => {
			const checkbox = document.createElement("input");
			checkbox.type = "checkbox";
			checkbox.checked = item.checked;
			checkbox.id = `checkbox-${item.id}`;

			const label = document.createElement("label");
			label.htmlFor = checkbox.id;
			label.textContent = item.label;

			const div = document.createElement("div");
			div.appendChild(checkbox);
			div.appendChild(label);

			checkbox.addEventListener("change", (event: Event) => {
				const target = event.target as HTMLInputElement;
				item.checked = target.checked;
				console.log(`Item ${item.id} checked: ${item.checked}`);
			});

			container.appendChild(div);
		});
	}
}
