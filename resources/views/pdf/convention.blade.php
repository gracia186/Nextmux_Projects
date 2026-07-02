<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Convention de Stage</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 12px;
            color: #1a1a1a;
            background: #fff;
            padding: 50px;
            line-height: 1.7;
        }

        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #1a1a1a;
            padding-bottom: 20px;
        }

        .header .company-name {
            font-size: 26px;
            font-weight: bold;
            letter-spacing: 4px;
            text-transform: uppercase;
        }

        .document-title {
            text-align: center;
            margin: 30px 0;
        }

        .document-title h1 {
            font-size: 20px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 2px;
            border-bottom: 2px solid #1a1a1a;
            display: inline-block;
            padding-bottom: 6px;
        }

        .document-number {
            text-align: right;
            font-size: 10px;
            color: #555;
            margin-bottom: 20px;
        }

        .section {
            margin: 24px 0;
        }

        .section-title {
            font-size: 13px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 4px;
            margin-bottom: 12px;
        }

        .info-table {
            width: 100%;
            border-collapse: collapse;
        }

        .info-table td {
            padding: 5px 8px;
            font-size: 12px;
            border: 1px solid #ddd;
        }

        .info-table td:first-child {
            font-weight: bold;
            background: #f5f5f5;
            width: 200px;
        }

        .article {
            margin: 16px 0;
        }

        .article-title {
            font-weight: bold;
            font-size: 12px;
            margin-bottom: 6px;
        }

        .article p {
            text-align: justify;
            font-size: 12px;
        }

        .signatures {
            margin-top: 50px;
            display: table;
            width: 100%;
        }

        .sig-block {
            display: table-cell;
            width: 33%;
            text-align: center;
            vertical-align: top;
            padding: 0 10px;
        }

        .sig-label {
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
        }

        .sig-name {
            font-size: 11px;
            color: #333;
            margin-bottom: 50px;
        }

        .sig-line {
            border-top: 1px solid #1a1a1a;
            padding-top: 4px;
            font-size: 10px;
            color: #555;
        }

        .stamp-area {
            text-align: center;
            margin-top: 30px;
            border: 2px dashed #ccc;
            padding: 16px;
            color: #aaa;
            font-size: 10px;
            letter-spacing: 2px;
            text-transform: uppercase;
        }
    </style>
</head>
<body>

    <div class="header">
        <div class="company-name">NEXTMUX</div>
    </div>

    <div class="document-number">
        N° {{ $documentNumber }} — Émis le {{ $generatedAt->format('d/m/Y') }}
    </div>

    <div class="document-title">
        <h1>Convention de Stage</h1>
    </div>

    <div class="section">
        <div class="section-title">Article 1 — Parties concernées</div>
        <table class="info-table">
            <tr>
                <td>Entreprise d'accueil</td>
                <td><strong>NEXTMUX</strong></td>
            </tr>
            <tr>
                <td>Stagiaire</td>
                <td><strong>{{ $intern->name }}</strong></td>
            </tr>
            <tr>
                <td>Email du stagiaire</td>
                <td>{{ $intern->email }}</td>
            </tr>
            @if($internship->mentor)
            <tr>
                <td>Tuteur / Mentor</td>
                <td>{{ $internship->mentor->name }}</td>
            </tr>
            @endif
        </table>
    </div>

    <div class="section">
        <div class="section-title">Article 2 — Objet et durée du stage</div>
        <table class="info-table">
            <tr>
                <td>Date de début</td>
                <td>{{ $internship->start_date->format('d/m/Y') }}</td>
            </tr>
            <tr>
                <td>Date de fin</td>
                <td>{{ $internship->end_date->format('d/m/Y') }}</td>
            </tr>
            <tr>
                <td>Durée totale</td>
                <td>{{ $internship->duration_days }} jours ouvrés</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Article 3 — Engagements de l'entreprise</div>
        <div class="article">
            <p>
                NEXTMUX s'engage à accueillir le stagiaire dans les meilleures conditions,
                à lui fournir les moyens nécessaires à l'accomplissement de sa mission,
                à désigner un tuteur chargé de son encadrement, et à lui délivrer
                une attestation de stage à l'issue de la période.
            </p>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Article 4 — Engagements du stagiaire</div>
        <div class="article">
            <p>
                Le stagiaire s'engage à respecter le règlement intérieur de NEXTMUX,
                à effectuer les missions qui lui sont confiées avec sérieux et professionnalisme,
                à respecter la confidentialité des informations auxquelles il aura accès,
                et à informer son tuteur de tout problème rencontré dans l'exécution de ses missions.
            </p>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Article 5 — Confidentialité</div>
        <div class="article">
            <p>
                Le stagiaire s'engage à ne divulguer aucune information confidentielle
                relative aux activités, projets, clients ou procédés de NEXTMUX,
                pendant et après la durée du stage.
            </p>
        </div>
    </div>

    <div class="signatures">
        <div class="sig-block">
            <div class="sig-label">Le Stagiaire</div>
            <div class="sig-name">{{ $intern->name }}</div>
            <div class="sig-line">Signature</div>
        </div>
        <div class="sig-block">
            @if($internship->mentor)
            <div class="sig-label">Le Tuteur</div>
            <div class="sig-name">{{ $internship->mentor->name }}</div>
            <div class="sig-line">Signature</div>
            @endif
        </div>
        <div class="sig-block">
            <div class="sig-label">Pour NEXTMUX</div>
            <div class="sig-name">La Direction</div>
            <div class="sig-line">Cachet + Signature</div>
        </div>
    </div>

    <div class="stamp-area">
        Cachet officiel de l'entreprise
    </div>

</body>
</html>