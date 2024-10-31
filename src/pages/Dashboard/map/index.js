import React from "react";

export default function SimpleMap(){


  return (
    // Important! Always set the container height explicitly
    <div style={{ height: '100%', width: '100%' }}>
      <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.6526501117964!2d105.77691077464436!3d10.045494790062257!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a089faa9021503%3A0x8a55dc32342b3ea8!2zR29HaSBIb3VzZSBWaW5jb20gSMO5bmcgVsawxqFuZw!5e0!3m2!1svi!2s!4v1718265510394!5m2!1svi!2s" width="600" height="450" style={{border: '0'}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
  );
}