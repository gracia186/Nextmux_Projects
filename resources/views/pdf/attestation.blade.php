<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Attestation de Stage</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 13px;
            color: #1a1a1a;
            background: #fff;
            padding: 60px;
            line-height: 1.6;
        }

        .header {
            text-align: center;
            margin-bottom: 50px;
            border-bottom: 3px solid #1a1a1a;
            padding-bottom: 20px;
        }

        .header .company-name {
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 4px;
            text-transform: uppercase;
        }

        .header .company-subtitle {
            font-size: 12px;
            color: #555;
            margin-top: 4px;
        }

        .document-title {
            text-align: center;
            margin: 40px 0;
        }

        .document-title h1 {
            font-size: 22px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 3px;
            border-bottom: 2px solid #1a1a1a;
            display: inline-block;
            padding-bottom: 6px;
        }

        .document-number {
            text-align: right;
            font-size: 11px;
            color: #555;
            margin-bottom: 30px;
        }

        .content {
            margin: 40px 0;
            text-align: justify;
        }

        .content p {
            margin-bottom: 16px;
            font-size: 13px;
        }

        .intern-info {
            background: #f5f5f5;
            border-left: 4px solid #1a1a1a;
            padding: 16px 20px;
            margin: 30px 0;
        }

        .intern-info table {
            width: 100%;
            border-collapse: collapse;
        }

        .intern-info table td {
            padding: 6px 0;
            font-size: 13px;
        }

        .intern-info table td:first-child {
            font-weight: bold;
            width: 180px;
            color: #333;
        }

        .footer {
            margin-top: 60px;
        }

        .footer .date {
            margin-bottom: 40px;
            font-size: 12px;
        }

        .signature-block {
            display: table;
            width: 100%;
        }

        .signature-left {
            display: table-cell;
            width: 50%;
            vertical-align: top;
        }

        .signature-right {
            display: table-cell;
            width: 50%;
            vertical-align: top;
            text-align: right;
        }

        .signature-label {
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 50px;
        }

        .signature-name {
            font-size: 12px;
            border-top: 1px solid #1a1a1a;
            padding-top: 6px;
            display: inline-block;
            min-width: 180px;
        }

        .stamp-area {
            text-align: center;
            margin-top: 40px;
            border: 2px dashed #ccc;
            padding: 20px;
            color: #aaa;
            font-size: 11px;
            letter-spacing: 2px;
            text-transform: uppercase;
        }
    </style>
</head>
<body>

    <div class="header">
        <div class="company-name">NEXTMUX</div>
        <div class="company-subtitle">Plateforme de Gestion des Stagiaires</div>
    </div>

    <div class="document-number">
        N° {{ $documentNumber }} — Émis le {{ $generatedAt->format('d/m/Y') }}
    </div>

    <div class="document-title">
        <h1>Attestation de Stage</h1>
    </div>

    <div class="content">
        <p>
            Je soussigné(e), représentant(e) de la société <strong>NEXTMUX</strong>,
            atteste par la présente que :
        </p>

        <div class="intern-info">
            <table>
                <tr>
                    <td>Nom et Prénom :</td>
                    <td><strong>{{ $intern->name }}</strong></td>
                </tr>
                <tr>
                    <td>Email :</td>
                    <td>{{ $intern->email }}</td>
                </tr>
                <tr>
                    <td>Date de début :</td>
                    <td>{{ $internship->start_date->format('d/m/Y') }}</td>
                </tr>
                <tr>
                    <td>Date de fin :</td>
                    <td>{{ $internship->end_date->format('d/m/Y') }}</td>
                </tr>
                <tr>
                    <td>Durée :</td>
                    <td>{{ $internship->duration_days }} jours ouvrés</td>
                </tr>
            </table>
        </div>

        <p>
            a effectué un stage au sein de notre structure durant la période
            indiquée ci-dessus, dans le cadre de sa formation professionnelle.
        </p>

        <p>
            Ce stage s'est déroulé dans de bonnes conditions et l'intéressé(e)
            a fait preuve de sérieux et d'implication tout au long de sa mission.
        </p>

        <p>
            La présente attestation est délivrée à l'intéressé(e) pour servir
            et valoir ce que de droit.
        </p>
    </div>

    <div class="footer">
        <div class="date">
            Fait à Cotonou, le {{ $generatedAt->format('d/m/Y') }}
        </div>

        <div class="signature-block">
            <div class="signature-left">
                <div class="signature-label">Le/La Stagiaire</div>
                <div class="signature-name">{{ $intern->name }}</div>
            </div>
            <div class="signature-right">
                <div class="signature-label">Pour NEXTMUX</div>
                <div class="signature-name">La Direction</div>
            </div>
        </div>

        <div class="stamp-area">
            Cachet et Signature
        </div>
    </div>

</body>
</html>