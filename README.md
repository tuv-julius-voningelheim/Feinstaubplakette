# Feinstaubplakette

High-Fidelity-Prototyp einer responsiven Landingpage für die TÜV SÜD Feinstaubplakette.

## Vorschau

Die Seite ist statisch und kann direkt über `index.html` oder einen lokalen HTTP-Server geöffnet werden:

```powershell
python -m http.server 4173
```

Anschließend ist sie unter `http://127.0.0.1:4173` erreichbar.

## GitHub Pages

Der Workflow `.github/workflows/deploy-pages.yml` veröffentlicht den aktuellen Stand bei jedem Push auf `main`. In den Repository-Einstellungen muss unter **Pages > Build and deployment** als Quelle **GitHub Actions** ausgewählt sein.

## Umfang

- Responsives Desktop- und Mobile-Layout
- Conversion-orientierte Landingpage
- Interaktive FAQ
- Simulierter Einstieg in die Bestellung
- TÜV SÜD Algorithm Design Tokens und lokale Markenfonts

Der Bestellprozess ist ausschließlich prototypisch. Es gibt keine Backend-, Upload- oder Zahlungsfunktion.