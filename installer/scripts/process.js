/**
 * MOHA Chat 
 * Copyright (C) 2006 S.H.Mohanjith, http://www.mohanjith.net
 *
 * MOHA Chat is free software; you can redistribute it and/or modify it under the terms of
 * the GNU General Public License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 *
 * MOHA Chat is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; 
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with this program;
 * if not, write to the Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
 * Boston, MA  02110-1301, USA
 *
 */

pages = ['welcome', 'license', 'preReq', 'database', 'config', 'confirm', 'installing', 'finish'];

function $(id) {
	return document.getElementById(id);
};

function goBack() {
	if (!pages[page-1]) {
		$('back').disabled = 'true';
		return false;
	}
	
	$('q').value = pages[page-1];
			
	$('response').submit();
}

function nextX() {
	
	if (!pages[page+1]) {
		$('next').disabled = 'true';
		return false;
	}
	
	$('q').value = pages[page+1];
	
	if (!validate()) return false;
		
	$('response').submit();
}

function validate () {
	return true;
}

getRadioGroup = function (id) {
	inputs = document.getElementsByTagName('input');
	
	for (i=0; i<inputs.length; i++) {
		if ((inputs[i].type == 'radio') && (inputs[i].id == id) && inputs[i].checked) {			
			return inputs[i];
		}
	}
}

onload = function () {	
	if (!pages[page-1]) {
		$('back').disabled = 'true';		
	}
	if (!pages[page+1]) {
		$('next').disabled = 'true';
	}
	
	for (i=0; i<page; i++) {
		$('step'+pages[i]).className = 'done';
	}
	
	$('step'+pages[i]).className = 'current';
	
	if (page+1 < pages.length) {	
		for (i=page+1; i<pages.length-1; i++) {
			$('step'+pages[i]).className = 'pending';
		}
	}
	
	if (!passed) {
		$('next').disabled = 'true';
	}
}
