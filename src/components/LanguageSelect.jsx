import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import languages from '../locales/index.js';

export default function LanguageSelect() {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  return (
    <Form.Select
      value={language}
      onChange={({ target: { value } }) => {
        setLanguage(value);
        i18n.changeLanguage(value);
      }}
    >
      {Object.keys(languages).map((lang) => (
        <option value={lang}>{t(lang)}</option>
      ))}
    </Form.Select>
  );
}
