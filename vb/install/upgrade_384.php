<?php
/*======================================================================*\
|| #################################################################### ||
|| # vBulletin 3.8.7 Patch Level 2 - Licence Number VBFB8C6115
|| # ---------------------------------------------------------------- # ||
|| # Copyright �2000-2012 vBulletin Solutions, Inc. All Rights Reserved. ||
|| # This file may not be redistributed in whole or significant part. # ||
|| # ---------------- VBULLETIN IS NOT FREE SOFTWARE ---------------- # ||
|| # http://www.vbulletin.com | http://www.vbulletin.com/license.html # ||
|| #################################################################### ||
\*======================================================================*/

error_reporting(E_ALL & ~E_NOTICE & ~8192);

define('THIS_SCRIPT', 'upgrade_384.php');
define('VERSION', '3.8.4');
define('PREV_VERSION', '3.8.3');

$phrasegroups = array();
$specialtemplates = array();

// #############################################################################
// require the code that makes it all work...
require_once('./upgradecore.php');

// #############################################################################
// welcome step
if ($vbulletin->GPC['step'] == 'welcome')
{
	if ($vbulletin->options['templateversion'] == PREV_VERSION)
	{
		echo "<blockquote><p>&nbsp;</p>";
		echo "$vbphrase[upgrade_start_message]";
		echo "<p>&nbsp;</p></blockquote>";
	}
	else
	{
		echo "<blockquote><p>&nbsp;</p>";
		echo "$vbphrase[upgrade_wrong_version]";
		echo "<p>&nbsp;</p></blockquote>";
		print_upgrade_footer();
	}
}

// #############################################################################
if ($vbulletin->GPC['step'] == 1)
{
	$upgrade->run_query(
		sprintf($upgrade_phrases['upgrade_300b3.php']['altering_x_table'], 'thread', 1, 1),
		"ALTER TABLE " . TABLE_PREFIX . "thread CHANGE lastposter lastposter VARCHAR(100) NOT NULL default ''"
	);

	$upgrade->execute();
}

// #############################################################################
// FINAL step (notice the SCRIPTCOMPLETE define)
if ($vbulletin->GPC['step'] == 2)
{
	// tell log_upgrade_step() that the script is done
	define('SCRIPTCOMPLETE', true);
}


// #############################################################################

print_next_step();
print_upgrade_footer();

/*======================================================================*\
|| ####################################################################
|| # Downloaded: 12:39, Wed May 30th 2012
|| # CVS: $RCSfile$ - $Revision: 13568 $
|| ####################################################################
\*======================================================================*/
?>
