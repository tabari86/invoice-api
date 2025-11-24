/**
 * Allgemeine Validierungs-Middleware für Joi-Schemas.
 */

module.exports = function validateRequest(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // alle Fehler sammeln, nicht nach dem ersten stoppen
      stripUnknown: true, // unbekannte Felder entfernen
    });

    if (error) {
      return res.status(400).json({
        message: "Validierungsfehler",
        details: error.details.map((d) => d.message),
      });
    }

    // geprüftes & bereinigtes Objekt an Request hängen
    req.validatedBody = value;
    next();
  };
};
